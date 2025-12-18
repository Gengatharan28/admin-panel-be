


export const removeProperties = <T>(obj: T, properties: Array<keyof T>) => {
    properties.forEach(pro => removeProperty(obj, pro));
};

export const removeProperty = <T>(obj: T, property: keyof T) => {
    if (obj) delete obj[property];
};

export const getPagination = (count: number | null, page: number) => {
    let limit = undefined;
    let offset = undefined
    if (count) {
        limit = count;
        offset = (page * count) - count;
    }

    return { limit, offset };
};

export const getPaginationRes = (count: number | null, totalCount: number) => {
    let totalPage = 1;
    if (count) totalPage = Math.ceil(totalCount / count);

    return {
        totalCount,
        totalPage
    }
}