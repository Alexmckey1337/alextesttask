"use client";

import { useState } from "react";
import { initializeDB } from "../db/db";

interface CardProps {
  id: number | string;
  title: string;
  body: string;
  isCreate?: boolean;
  handleModalClose?: () => void | undefined;
}

export const Card = ({
  id,
  title,
  body,
  isCreate = false,
  handleModalClose,
}: CardProps) => {
  const [isDisabled, setIsDisabled] = useState(isCreate ? false : true);
  const [titleValue, setTitleValue] = useState(title);
  const [bodyValue, setBodyValue] = useState(body);
  const postsCollection = initializeDB();

  const handleSaveClick = async () => {
    const reqBody = {
      id: id,
      title: titleValue,
      body: bodyValue,
      userId: 1,
    };

    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const document = (await postsCollection).findOne(id.toString());
    await document.patch(reqBody);
  };

  const handleCreate = async () => {
    const reqBody = {
      id: id,
      title: titleValue,
      body: bodyValue,
      userId: 1,
    };

    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    (await postsCollection).insert(reqBody);
    handleModalClose?.();
  };

  const handleEditClick = () => {
    console.log("click");
    setIsDisabled(!isDisabled);
  };
  const handleDeleteClick = async () => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });
    const document = (await postsCollection).findOne(id.toString());
    await document.remove();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBodyValue(e.target.value);
  };

  return (
    <div
      key={id}
      className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <input
        value={titleValue}
        onChange={handleTitleChange}
        className="mb-2 text-2xl font-bold tracking-tight text-gray-800 dark:text-white w-[95%] border-white"
        disabled={isDisabled}
        placeholder="Title"
      />

      <input
        value={bodyValue}
        onChange={handleBodyChange}
        disabled={isDisabled}
        placeholder="Body"
        className="my-2 text-1xl font-bold tracking-tight text-gray-800 dark:text-white w-[95%] border-white"
      />
      <div className="flex max-w-full flex-row mt-4">
        {!isCreate && (
          <button
            className="bg-gray-600 text-white px-3 py-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
            onClick={handleEditClick}
          >
            Edit
          </button>
        )}
        <button
          className="ml-auto bg-gray-600 text-white px-3 py-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
          onClick={isCreate ? handleCreate : handleSaveClick}
        >
          {isCreate ? "Create new" : "Save"}
        </button>
        {!isCreate && (
          <button
            className="ml-auto bg-gray-600 text-white px-3 py-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
