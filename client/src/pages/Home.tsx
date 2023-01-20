import { useEffect, useState } from "react"

import { Card, FormField, Loader } from "../components"
import { CardProps } from "../components/Card"

const API_URL = import.meta.env.VITE_API_URL

interface PostProps {
  _id: string
}

interface RenderCardsProps {
  data: PostProps[]
  title: string
}

const RenderCards = ({ data, title }: RenderCardsProps): JSX.Element => {
  if (data.length > 0) {
    return (
      <>
        {data.map((post) => (
          <Card key={post._id} {...(post as CardProps)} />
        ))}
      </>
    )
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        const response = await fetch(API_URL + "/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log(response)
        if (response.ok) {
          const results = await response.json()
          setAllPosts(results.data.reverse())
        }
      } catch (error) {
        console.error(error)
        alert(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated by DALL-E AI
        </p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Filter"
          name="filter"
          placeholder="filter"
          type="text"
          value={searchText}
          handleChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={[]} title="No search results found" />
              ) : (
                <RenderCards data={allPosts} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home
