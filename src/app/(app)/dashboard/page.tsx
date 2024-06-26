'use client'
import { useSession } from 'next-auth/react';
import React, { useState, ChangeEvent } from 'react';

const Page = () => {
  const { data: session, status } = useSession();

  // Use File[] to maintain an array of files
  const [files, setFiles] = useState<File[]>([]);
  const [examName, setExamName] = useState<string>("test");

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []); // Convert FileList to array
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();

    // Add each file to the FormData
    files.forEach((file, index) => {
      form.append(`file${index + 1}`, file); // Use unique keys for each file
    });

    console.log("Session:", session); // Check the session data
    console.log("Adding username to form data:", session?.user?.username); // Check username

    form.append('name', examName); // Add a name to form data
    form.append('username', session?.user?.username || ""); // Ensure this doesn't throw if undefined

    // Loop through FormData to confirm data has been appended correctly
    console.log("FormData contents:");
    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await fetch('/api/exam-analyzer', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      console.log('Response:', result.data);
    } catch (error) {
      console.error('Error submitting files:', error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} multiple />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Files to be uploaded:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
