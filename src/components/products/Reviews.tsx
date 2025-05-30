"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";

interface ReviewsProps {
  productId: number;
  reviews: Array<{
    id: number;
    comment: string;
    grade: number;
    img?: { url: string };
    username?: string;
  }>;
}

interface FormValues {
  review: string;
}

interface ReviewPayload {
  data: {
    comment: string;
    grade: number;
    product: {
      connect: number[];
    };
    img?: {
      connect: number[];
    };
  };
}

export default function Reviews({ productId, reviews }: ReviewsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, handleSubmit, reset } = useForm<FormValues>();

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
          grade: 1,
          product: {
            connect: [productId]
          },
        },
      };

      if (imageId) {
        payload.data.img = {
          connect: [imageId]
        };
      }

      const createRes = await fetch(
        "http://localhost:1337/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

      console.log("Review + image envoyées ✅");
      reset();
    } catch (error) {
      console.error("Erreur d'envoi :", error);
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Avis</h2>

      {reviews.length > 0 && (
        <div className="flex flex-col gap-4 mb-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {review.username ? review.username[0].toUpperCase() : 'A'}
                </div>
                <span className="font-semibold">{review.username || 'Anonyme'}</span>
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
                  src={`http://localhost:1337${review.img.formats.thumbnail.url}`}
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        encType="multipart/form-data"
      >
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
    </div>
  );
}
