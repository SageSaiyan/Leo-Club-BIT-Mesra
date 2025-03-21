
import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase-config';
import {getDocs, collection, deleteDoc, doc} from 'firebase/firestore'
import { query, orderBy, limit } from 'firebase/firestore';
import './blog.css'
import gsap from 'gsap';
import { Link } from 'react-router-dom'; 
const BlogHome = () => {
  const [postLists, setPostLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const postCollectionRef = collection(db, 'posts');

  const q = query(postCollectionRef, orderBy("date", "desc"), limit(1));

  const getPosts = async() => {
    setLoading(true);
    const data = await getDocs(q);
    setPostLists(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    setLoading(false)
  }
  useEffect(() => {
    getPosts();
  },[])

   useEffect(() => {
      if (!loading) {
        const blogelements = [
            { trigger: '.gblog-heading', animation: { scale: 0, duration: 1 } },
            { trigger: '.gblog-image', animation: { x: 250, opacity: 0, duration: 1} },
            { trigger: '.gblog-title', animation: { y: 150, opacity: 0, duration: 1 } },
            { trigger: '.gblog-content', animation: { y: 150, opacity: 0, duration: 1 } },
           { trigger: '.gblog-button', animation: { y: -100, opacity: 0, duration: 1, ease: 'bounce.out' } },
          ];
         blogelements.forEach((el) => {
             gsap.from(el.trigger, {
                 ...el.animation,
                  scrollTrigger: {
                 trigger: el.trigger,
                 start: "top 80%",
                  },
              });
          });
      }
    }, [loading]);

  if(loading) {
    return (
    <h3 className='bg-white h-screen flex items-center justify-center text-white'>Loading....</h3>
    )
  }
  return (
    <>
    <div>
      {postLists.length === 0 ? <h3>No Posts to show</h3> : postLists.map((post) => {
        return (
        <>
        <div className='blog-main-div sm:px-4 sm:py-8 py-2 px-2 overflow-hidden'>
        <div className='border-2 border-gray-600 rounded-md pb-5 boxDivblog'>
        <div className='headingblogdent flex justify-center items-center rounded-t-2xl '>
          <h1 className="text-4xl text-center font-black bg-blue-700 text-transparent bg-clip-text flex flex-wrap  gblog-heading">LATEST POST</h1>
        </div>
        <div className ="blog-main rounded-b-2xl">
        <div className="blog-info md:mt-12 sm:w-[50%] w-[100%]">
        <h5 className='text-black text-center min-h-[15%] h-auto text-3xl font-semibold border-b-2 border-gray-500 flex items-center'>{post.title}</h5>
        <p className="md:px-10 sm:px-7 px-2 py-10 text-justify w-[100%] whitespace-pre-wrap">
          {post.post.replaceAll(`\\n`, '\n')}
        </p>
        <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded gblog-button">
            <Link to="/blog" className='font-semibold text-white '>Link</Link>
        </button>
        </div>   
        {post.imgUrl && (
                    <div className="blog-image w-[50%]">
                      <img
                        src={post.imgUrl}
                        alt="Post"
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
        </div>
        </div>
        </div>
        </>
        )
      })}
    </div>
    </>
  )
}

export default BlogHome