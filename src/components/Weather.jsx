import React, { useState } from 'react'
import axios from 'axios'

export default function Weather() {

    const [Shownews, SetShownews] = useState([])

    const fetchNews = () => {
        axios.get('https://newsapi.org/v2/top-headlines?country=in&apiKey=1952c2dcd478493189e3951f0435b532').then((res) => {
            SetShownews(res.data.articles)
        })
    }
    return (
        <>
            <div className="flex  justify-center">
                <button onClick={fetchNews} className=' m-1 border-blue-400 border rounded p-1 bg-blue-400 hover:text-blue-500 hover:bg-white'>Show news</button>
            </div>
            <hr className=' w-1/5 mx-auto' />
            <div className=' grid grid-cols-1 lg:grid-cols-3 lg:gap-3 justify-items-center  ' >
                {
                    Shownews.map((value) => {
                        return (
                            <>
                                <div className=' py-10'>
                                    <div className=' rounded overflow-hidden shadow-lg max-w-sm  '>
                                        <img src={value.urlToImage} alt="..." srcset="" className=' w-full' />
                                        <div className=' px-4 py-4'>
                                            <div className=' font-bold text-xl mb-2 '>{value.title}</div>
                                            <p className=' text-gray-600'>{value.description}</p>
                                        </div>
                                            <a className=' bg-blue-400 flex justify-center hover:bg-white hover:text-blue-600 mx-auto p-1 ' href={value.url}>Read More</a>
                                    </div>

                                </div>
                            </>
                        )

                    })
                }

            </div>
        </>

    )
}
