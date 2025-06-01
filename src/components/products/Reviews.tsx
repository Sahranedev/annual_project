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
      <h2 className="text-2xl font-bold mb-4">Avis</h2>
      <p className="text-sm text-gray-500 mb-4">
        Note moyenne : {averageGrade} ({totalReviews} avis)
      </p>
      <div className="flex flex-col gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <span key={index} className={`${index <= star ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
            ))}
            <span className="text-gray-500">{gradeCount[star as keyof typeof gradeCount]}</span>
          </div>
        ))}
      </div>

      {token ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mb-8"
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
            placeholder="Votre avis..."
            className="bg-gray-100 p-4 rounded-md focus:outline-none"
            rows={4}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="bg-gray-100 p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 transition"
          >
            Envoyer
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          <p className="text-gray-500">Veuillez vous connecter pour laisser un avis</p>
          <button className="bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 transition">
            Se connecter
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Liste des avis</h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="desc">Note décroissante</option>
          <option value="asc">Note croissante</option>
        </select>
      </div>

      {reviews.length > 0 && (
        <div className="flex flex-col gap-4 mb-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {review.user && review.user.username ? review.user.username[0].toUpperCase() : 'A'}
                </div>
                <span className="font-semibold">{review.user && review.user.username || 'Anonyme'}</span>
              </div>
              <p className="mb-2">
                {Array.from({ length: review.grade }, (_, i) => (
                  <span key={i} className="text-yellow-500">
                    ★
                  </span>
                ))}
                {Array.from(
                  { length: 5 - review.grade },
                  (_, i) => (
                    <span key={i} className="text-gray-300">
                      ★
                    </span>
                  )
                )}
              </p>
              <p className="mb-2">{review.comment}</p>
              {review.img && (
                <Image
                  src={`http://localhost:1337${review.img.url}`}
                  alt="Illustration de l'avis"
                  width={200}
                  height={200}
                  objectFit="cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

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
