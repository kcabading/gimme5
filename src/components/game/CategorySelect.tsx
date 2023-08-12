import { Apple, Cat, MapPin, PersonStanding, Shirt } from 'lucide-react';

type ICategorySelectProps = {
    categories: string[],
    handleCategorySelect: (category: string) => void
}

let categoryImage = [<PersonStanding className='w-full h-12' />, <Shirt className='w-full h-12'/>, <Cat className='w-full h-12'/>, <Apple className='w-full h-12'/>, <MapPin className='w-full h-12'/>]

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
                                className={`${index === 2 ? 'col-start-3' : ''} col-span-4 px-5 py-5 text-black dark:bg-white font-bold dark:hover:bg-amber-300 hover:bg-amber-300 rounded-2xl text-2xl sm:text-4xl shadow-2xl relative`}
                                onClick={() => handleCategorySelect(cat)} 
                            >
                                {cat}
                                <span className="absolute left-5 top-3">{categoryImage[index]}</span>
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
 