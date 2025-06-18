"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface ReviewsProps {
  productId: number;
  productSlug: string;
}

interface Review {
  id: number;
  comment: string;
  grade: number;
  img?: { url: string };
  username?: string;
  user: {
    username: string;
  };
}

interface FormValues {
  review: string;
  rating: number;
}

interface ReviewPayload {
  data: {
    comment: string;
    grade: number;
    product: number;
    img?: number;
  };
}

export default function Reviews({ productId, productSlug }: ReviewsProps) {
  const token = localStorage.getItem('token')
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageGrade, setAverageGrade] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [gradeCount, setGradeCount] = useState<{
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const fetchReviews = async () => {
    setGradeCount({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    try {
      const res = await fetch(
        `http://localhost:1337/api/reviews?filters[product][slug][$eq]=${productSlug}&populate[img]=true&populate[user]=true&pagination[pageSize]=5&pagination[page]=${currentPage}&sort[0]=grade:${sortOrder}`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Échec du chargement des avis');
      const data = await res.json();

      setAverageGrade(data.meta.ratingStats.average);
      setGradeCount(data.meta.ratingStats.counts);
      setReviews(data.data);
      setPageCount(data.meta.pagination.pageCount);
      setTotalReviews(data.meta.ratingStats.totalRatings);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productSlug, currentPage, sortOrder]);

  const onSubmit = async (data: FormValues) => {
    try {
      let imageId: number | null = null;

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const fileForm = new FormData();
        fileForm.append("files", file, file.name);

        const uploadRes = await fetch(
          "http://localhost:1337/api/upload",
          {
            method: "POST",
            body: fileForm,
          }
        );

        if (!uploadRes.ok) {
          const err = await uploadRes.text();
          throw new Error(`Upload failed: ${err}`);
        }

        const uploaded = (await uploadRes.json()) as Array<{
          id: number;
        }>;
        imageId = uploaded[0]?.id ?? null;
      }      

      const payload: ReviewPayload = {
        data: {
          comment: data.review,
          grade: rating,
          product: productId,
        },
      };

      if (imageId) {
        payload.data.img = imageId;
      }

      const createRes = await fetch(
        "http://localhost:1337/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(
          `Review creation failed: ${JSON.stringify(err)}`
        );
      }

      reset();
      setRating(0);
      // Reload reviews after adding a new one
      await fetchReviews();
    } catch (error) {
      console.error("Erreur d'envoi :", error);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    setValue('rating', value);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Avis clients</h2>
      
      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl font-bold text-gray-900">{averageGrade.toFixed(1)}</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-2xl ${star <= Math.round(averageGrade) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
            ))}
          </div>
          <p className="text-sm text-gray-500">Basé sur {totalReviews} avis</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex flex-col gap-2 mb-8">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <div className="w-16 text-sm text-gray-600">{star} étoiles</div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ 
                  width: `${(gradeCount[star as keyof typeof gradeCount] / totalReviews) * 100}%` 
                }}
              />
            </div>
            <div className="w-12 text-sm text-gray-600 text-right">
              {gradeCount[star as keyof typeof gradeCount]}
            </div>
          </div>
        ))}
      </div>

      {/* Review Form */}
      {token ? (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Ajouter un avis</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  <span className={star <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <textarea
              id="review"
              {...register("review", { required: true })}
              placeholder="Partagez votre expérience avec ce produit..."
              className="bg-white p-4 rounded-md focus:outline-none border border-gray-300 focus:border-pink-500"
              rows={4}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Ajouter une photo (optionnel)</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="bg-white p-2 rounded-md border border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="bg-pink-600 text-white p-4 rounded-md hover:bg-pink-700 transition"
            >
              Publier mon avis
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Veuillez vous connecter pour laisser un avis</p>
          <button className="bg-pink-600 text-white p-4 rounded-md hover:bg-pink-700 transition">
            Se connecter
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Tous les avis</h3>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="desc">Plus récents</option>
            <option value="asc">Plus anciens</option>
          </select>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                    {review.user && review.user.username ? review.user.username[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="font-semibold">{review.user && review.user.username || 'Anonyme'}</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.grade }, (_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                      {Array.from({ length: 5 - review.grade }, (_, i) => (
                        <span key={i} className="text-gray-300">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                {review.img && (
                  <div className="mt-4">
                    <Image
                      src={`http://localhost:1337${review.img.url}`}
                      alt="Illustration de l'avis"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucun avis pour le moment</p>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
            }`}
          >
            Précédent
          </button>
          
          <div className="flex gap-2">
            {[...Array(pageCount)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-pink-600 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            className={`px-4 py-2 rounded-md ${
              currentPage === pageCount
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
            }`}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
