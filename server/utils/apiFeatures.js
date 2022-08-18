class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; //hiểu là data của DB
    this.queryStr = queryStr; // là keyword khi mình nhập để lọc \
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          // nếu có thì :
          name: {
            $regex: this.queryStr.keyword, // regex tên theo key
            $options: 'i',
          },
        }
      : {};
    // sau đó gắn query với các data tìm được theo keyword
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ['keyword', 'page', 'limit'];
    removeFields.forEach((key) => delete queryCopy[key]);
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  pagination(resultPerPage) {
    const currentPage = this.queryStr.page || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;
