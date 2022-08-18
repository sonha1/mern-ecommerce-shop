export default (theFunc) => async (req, res, next) => {
  // /cach 1 :
  Promise.resolve(theFunc(req, res, next)).catch(next);
  //cach 2:
  // try {
  //   await theFunc(req, res, next);
  // } catch (err) {
  //   next(err);
  // }
};
