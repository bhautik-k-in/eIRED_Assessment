/**
 * Global Pagination
 * @param {*} model 
 * @param {*} pageNumber 
 * @param {*} pageSize 
 * @returns Paginated Results
 */
exports.paginate = async (model, condition = {}, pageNumber = 1, pageSize = 10) => {
    const count = await model.countDocuments(condition);
    const data = await model.find(condition).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ 'sequence': 'desc' }).populate("user", "name").lean();

    const results = {
        data,
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize)
    }
    return results;
};
