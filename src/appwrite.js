import { Client, Databases, Query, ID } from 'appwrite'; // Pastikan semua modul diimpor

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1') // Endpoint untuk Sydney
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 1. Cek apakah search term ada di database
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    // 2. Jika ada, update count
    if (result.documents.length > 0) {
      const doc = result.documents[0];

      // Pastikan count sudah terdefinisi
      const newCount = (doc.count || 0) + 1; // Menggunakan 0 jika count tidak ada
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: newCount,
      });
    } else {
      // 3. Jika tidak ada, buat dokumen baru
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};
