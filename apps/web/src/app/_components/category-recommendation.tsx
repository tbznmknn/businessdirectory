'use server';
import * as FaIcons from 'react-icons/fa';
import { CiCircleChevLeft, CiCircleChevRight } from 'react-icons/ci';
import { BusinessCategory } from '@businessdirectory/database';
import Link from 'next/link';
export default async function CategoryRecommendation() {
  console.log(process.env);
  const categories = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/business-categories?limit=50`
  );
  const categoriesData: BusinessCategory[] = (await categories.json()).data;

  console.log(categoriesData);
  return (
    <div className="w-full mt-10 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h3>Та юу хайж байна вэ?</h3>
        <div className="flex items-center gap-2">
          <CiCircleChevLeft className="size-8 cursor-pointer hover:scale-110 transition-all duration-300 xl:size-10" />
          <CiCircleChevRight className="size-8 cursor-pointer hover:scale-110 transition-all duration-300 xl:size-10" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {categoriesData.slice(0, 6).map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
function CategoryCard({ category }: { category: BusinessCategory }) {
  const Icon =
    FaIcons[category.icon as keyof typeof FaIcons] || FaIcons.FaRegSquare;
  return (
    <Link href={`/categories/${category.id}`}>
      {' '}
      <div className="flex hover:scale-105 transition-all duration-300 items-center justify-center flex-col gap-2">
        <Icon className="size-8 text-muted" />
        {category.name}
      </div>
    </Link>
  );
}
