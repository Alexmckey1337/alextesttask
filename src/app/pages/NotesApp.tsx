"use client";

import { useEffect, useState } from "react";

import { Subscription } from "rxjs";
import useModal from "../hooks/useModal";
import { initializeDB } from "../db/db";
import MyModal from "../components/Modal";
import { Card } from "../components/Card";

type Post = {
  userId: number;
  id: number | string;
  title: string;
  body: string;
};

const fetchPostsFromApi = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
};

export default function NotesApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("Service Worker registration failed:", error);
          });
      });
    }
    let postsSubscription: Subscription;

    const fetchPosts = async () => {
      const postsCollection = await initializeDB();
      const postsCount = await postsCollection.count().exec();
      if (postsCount === 0) {
        const apiPosts = await fetchPostsFromApi();
        const formattedPosts = apiPosts.map((post: Post) => ({
          ...post,
          id: post.id.toString(),
        }));
        (await postsCollection).bulkInsert(formattedPosts);
      }
      postsSubscription = postsCollection
        .find()
        .$.subscribe((postDocuments) => {
          setPosts(postDocuments.map((doc) => doc.toJSON()));
        });
    };

    fetchPosts();

    return () => {
      if (postsSubscription) {
        postsSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <div className="main grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center justify-center min-h-screen">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add new note
        </button>

        <MyModal isOpen={isOpen} closeModal={closeModal} />
      </div>
      <main className="flex flex-wrap gap-[32px] row-start-2 items-center sm:items-start">
        {posts.map((post) => {
          return (
            <Card
              key={post.id}
              id={post.id}
              title={post.title}
              body={post.body}
            />
          );
        })}
      </main>
    </div>
  );
}
