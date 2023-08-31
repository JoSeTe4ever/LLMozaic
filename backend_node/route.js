const { default: Draft } = require("nylas/lib/models/draft");
const { default: Event } = require('nylas/lib/models/event');

const Nylas = require("nylas");

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

exports.readEvents = async (req, res) => {
  const user = res.locals.user;

  const { calendarId, startsAfter, endsBefore, limit } = req.body;

  const events = await Nylas.with(user.accessToken)
    .events.list({
      calendar_id: calendarId,
      starts_after: startsAfter,
      ends_before: endsBefore,
      limit: limit,
    })
    .then((events) => events);

  return res.json(events);
};

exports.getReadEvents = async (req, res) => {
  const user = res.locals.user;

  const { calendarId, startsAfter, endsBefore, limit } = req.query;

  const events = await Nylas.with(user.accessToken)
    .events.list({
      calendar_id: calendarId,
      starts_after: startsAfter,
      ends_before: endsBefore,
      limit: limit,
    })
    .then((events) => events);

  return res.json(events);
};

exports.readCalendars = async (req, res) => {
  const user = res.locals.user;

  const calendars = await Nylas.with(user.accessToken)
    .calendars.list()
    .then((calendars) => calendars);

  return res.json(calendars);
};

exports.createEvents = async (req, res) => {
  const user = res.locals.user;

  const { calendarId, title, description, startTime, endTime, participants } =
    req.body;

  if (!calendarId || !title || !startTime || !endTime) {
    return res.status(400).json({
      message:
        'Missing required fields: calendarId, title, starTime or endTime',
    });
  }

  const nylas = Nylas.with(user.accessToken);

  const event = new Event(nylas);

  event.calendarId = calendarId;
  event.title = title;
  event.description = description;
  event.when.startTime = startTime;
  event.when.endTime = endTime;

  if (Array.isArray(participants)) {
    event.save();
  }

  return res.json(event);
};


exports.getAllContacts = async (req, res) => {
  const user = res.locals.user;

  const contacts = await Nylas.with(user.accessToken)
    .contacts.list()
    .then((contacts) => contacts);

  return res.json(contacts);
};

exports.getContactById = async (req, res) => {
  const user = res.locals.user;

  const contact = await Nylas.with(user.accessToken)
    .contacts.find(id)
    .then((contact) => contact);

  return res.json(contact);
};
