const { default: Draft } = require('nylas/lib/models/draft');
const Nylas = require('nylas');

exports.sendEmail = async (req, res) => {
  const user = res.locals.user;

  const { to, subject, body, replyToMessageId } = req.body;

  const draft = new Draft(Nylas.with(user.accessToken));

  draft.from = [{ email: user.emailAddress }];
  draft.to = [{ email: to }];
  draft.subject = subject;
  draft.body = body;
  draft.replyToMessageId = replyToMessageId;

  const message = await draft.send();

  return res.json(message);
};

exports.readEmails = async (req, res) => {
  const user = res.locals.user;

  const nylas = Nylas.with(user.accessToken);

  const threads = await nylas.threads.list({ limit: 5, expanded: true });

  return res.json(threads);
};

exports.getMessage = async (req, res) => {
  const user = res.locals.user;

  const nylas = Nylas.with(user.accessToken);

  const { id } = req.query;
  const message = await nylas.messages.find(id);

  return res.json(message);
};

exports.getFile = async (req, res) => {
  const user = res.locals.user;

  const nylas = Nylas.with(user.accessToken);

  const { id } = req.query;
  const file = await nylas.files.find(id);

  // Files will be returned as a binary object
  const fileData = await file.download();
  return res.end(fileData?.body);
};
