'use server';
import * as FaIcons from 'react-icons/fa';
import { BusinessParentCategoryListResponse } from '@businessdirectory/database';
import Link from 'next/link';
export default async function CategoriesGrid() {
  const categories = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/business-parent-categories?limit=50`
  );
  const categoriesData: BusinessParentCategoryListResponse[] = (
    await categories.json()
  ).data;

  return (
    <div className="p-2 xl:p-0 w-full mt-10 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <h3>Компаниудыг төрлөөр хайцгаая</h3>
      </div>

      {/* Masonry layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [&>*]:mb-6">
        {categoriesData.map((category) => (
          <div key={category.id} className="break-inside-avoid">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
function CategoryCard({
  category,
}: {
  category: BusinessParentCategoryListResponse;
}) {
  const Icon =
    FaIcons[category.icon as keyof typeof FaIcons] || FaIcons.FaRegSquare;
  return (
    <div className="flex border border-border rounded-xl b-3 flex-col">
      <div className="p-4 bg-[#FFF7C4] flex flex-col gap-2 items-center text-center justify-center">
        <Icon className="size-8 text-muted" />
        <h3 className="text-lg font-light">{category.name}</h3>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {category.categories.map((category) => (
          <Link
            className="hover:text-secondary hover:underline border-b last:border-b-0 border-border pb-3 duration-300"
            key={category.id}
            href={`/yellow-books?categoryId=${category.id}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
