import YellowBooksList from './_components/yellow-books-list';

import { Suspense } from 'react';
export default function HomePage({
  searchParams,
}: {
  searchParams: { categoryId: string; parentCategoryId: string };
}) {
  const { categoryId, parentCategoryId } = searchParams;
  return (
    <div className="">
      <div className="flex mb-10 justify-center  items-center flex-col w-full">
        <div className="w-full max-w-7xl space-y-10  mx-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <YellowBooksList
              categoryId={categoryId}
              parentCategoryId={parentCategoryId}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
