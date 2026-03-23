import { useState, useEffect } from 'react'
import { getCategories,
          createCategory,
          updateCategory,
          deleteCategory
 } from '../api/categories.api'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try{
      setLoading(true)
      const {data} = await getCategories({active:true})
      setCategories(data)
    }catch(err){
      setError(err.response?.data?.message || 'Error al cargar categorías')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])
  const save = async (formData, id = null) =>{
    if(id){
      const{ data } = await updateCategory(id, formData)
      setCategories((prev) => prev.map((c) => (c.id === id ? data : c)))
    }else{
      const { data } = await createCategory(formData)
      setCategories((prev) => [...prev, data])
    }
  }
  const toggle = async (id, currentState) =>{
    if(currentState){
      await deleteCategory(id)
      setCategories((prev) =>
      prev.filter((c)=> c.id !== id))
    }else{
      await updateCategory(id, {isActive : true})
        setCategories((prev)=>
        prev.map((c)=> (c.id === id ?{...c, isActive : ture}: c)))
      
    }
  }
  return {categories, loading, error, save, toggle}
}
    