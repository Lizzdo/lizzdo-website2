// Utility functions for loading Decap CMS content

export const toArray = (obj: any): any[] => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
};

export const getCollection = (collectionGlob: Record<string, any>) => {
  const collection = Object.keys(collectionGlob).map((key) => {
    const file = collectionGlob[key];
    const slug = key.split('/').pop()?.replace('.json', '') || '';
    return {
      slug,
      ...(file.default || file)
    };
  });
  return collection.sort(sortByOrder);
};

export const getSingle = (fileGlob: Record<string, any>) => {
  const values = Object.values(fileGlob);
  return values.length > 0 ? (values[0] as any).default || values[0] : null;
};

export const sortByOrder = (a: any, b: any) => {
  const orderA = a.order !== undefined && a.order !== null && a.order !== "" ? Number(a.order) : Infinity;
  const orderB = b.order !== undefined && b.order !== null && b.order !== "" ? Number(b.order) : Infinity;
  
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  
  const dateA = a.date ? new Date(a.date).getTime() : 0;
  const dateB = b.date ? new Date(b.date).getTime() : 0;
  
  if (dateA !== dateB) {
    return dateB - dateA;
  }
  
  return 0;
};
