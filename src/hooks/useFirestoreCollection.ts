import { useEffect, useState } from "react"
import { db } from "@/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"

export function useFirestoreCollection<T>(collectionPath: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, collectionPath))
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[]
      setData(docs)
      setLoading(false)
    }

    fetchData()
  }, [collectionPath])

  return { data, loading }
}
