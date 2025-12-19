import Image from 'next/image'
import RenderTag from './RenderTag'

function RightSideBar() {
  return (
    <aside className=" justify-around items-stretch flex flex-col px-6 gap-16 right-0  top-0 sticky  min-h-screen max-w-82.5 max-xl:hidden  background-light900_dark200    border-l shadow-[10px_10px_20px_rgba(218,213,213,0.1)] ">
      <section className="hot_network flex flex-col  items-start justify-start gap-7.5  ">
        <h3 className="font-bold font-inter text-xl/[130%]">Hot Network</h3>
        <div className="questions_list flex items-start gap-2.5 body-medium font-inter ">
          <p>
            Would it be appropriate to point out an error in another paper during a referee report?
          </p>
          <Image
            src="assets/icons/chevron-right.svg"
            alt="chevron right"
            width={20}
            height={20}
            className="invert-colors"
          />
        </div>
      </section>
      <section className="popular_tags flex flex-col gap-13 items-stretch">
        <h3 className="font-bold font-inter text-xl/[130%]">Popular Tags</h3>
        <div className="tags_list">
          <RenderTag _id="javascript" name="JAVASCRIPT" totalQuestions={20153} showCount={true} />
        </div>
      </section>
    </aside>
  )
}

export default RightSideBar
