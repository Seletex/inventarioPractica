import multiparty from 'multiparty';

export const formularioDatos = (req, res, next) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    req.body = fields;
    req.files = files;
    next();
  });
};
