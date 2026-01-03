export function filterdData(products, selected, query, page, limit) {
  let filtered = [...products];

  // Get selected main category names (keys) that have selected sub-category IDs
  const selectedMainCategories = Object.keys(selected).filter(
    (cat) => selected[cat]?.length
  );

  // Text search
  if (query?.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter((p) => p.name?.toLowerCase().includes(q));
  }

  // Category & sub-category filter
  if (selectedMainCategories.length) {
    filtered = filtered.filter((p) => {
      const mainCatName = p.main_categories?.name;

      if (p.sub_category_id) {
        // If sub-category exists, check if its ID is in the selected IDs under the main category
        const selectedIDs = selected[mainCatName]?.map(Number) || [];
        return selectedIDs.includes(Number(p.sub_category_id));
      } else {
        // No sub-category → fallback to main category name
        return selectedMainCategories.includes(mainCatName);
      }
    });
  }

  // Pagination
  const start = (page - 1) * limit;
  return filtered.slice(start, start + limit).map((p) => p.id);
}
