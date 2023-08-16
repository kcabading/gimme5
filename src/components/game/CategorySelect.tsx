import { Apple, Cat, MapPin, PersonStanding, Shirt } from 'lucide-react';

type ICategorySelectProps = {
    categories: string[],
    handleCategorySelect: (category: string) => void
}

let categoryImage = [
    <PersonStanding className='h-12 w-10 inline -mt-2' />, 
    <Shirt className='h-12 w-10 inline -mt-2'/>, 
    <Cat className='h-12 w-10 inline -mt-2'/>, 
    <Apple className='h-12 w-10 inline -mt-2'/>, 
    <MapPin className='h-12 w-10 inline -mt-2'/>
]

const CategorySelect = ({categories, handleCategorySelect}: ICategorySelectProps ) => {
    return (
        <>
            <div className="gimme5-categories">
                <p className="text-2xl sm:text-4xl text-center mb-10 font-bold">SELECT YOUR CATEGORY</p>
                <div className="sm:grid sm:grid-cols-8 gap-5 flex flex-col">
                {
                    categories.map( (cat, index) => {
                        return (
                            <button
                                key={index}
                                className={`${index === 2 ? 'col-start-3' : ''} col-span-4 px-5 py-8 sm:py-5 bg-white text-black font-bold dark:hover:bg-amber-300 hover:bg-amber-300 rounded-2xl text-2xl sm:text-4xl shadow-2xl relative`}
                                onClick={() => handleCategorySelect(cat)} 
                            >
                                {categoryImage[index]} &nbsp;
                                {cat}
                            </button>
                        )
                    })
                }
                </div>
            </div>
        </>
    )
}

export default CategorySelect
 