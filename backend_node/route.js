const { default: Draft } = require("nylas/lib/models/draft");
const { default: Event } = require("nylas/lib/models/event");

const Nylas = require("nylas");

exports.greetingInfo = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const nylas = Nylas.with(user.accessToken);

    const threads = await nylas.threads.list({ unread: true });

    const calendar = (await nylas.calendars.list()).find(e => e.is_primary);
    const drafts = await nylas.drafts.list({ limit: 150, expanded: true });

    let events = [];

    if(calendar) {
      events = await nylas.events.list({
        calendar_id: calendar.id,
        starts_after: +new Date(),
        ends_before: +new Date() + 86400,
      });
    }

    const userInfo = {
      userEmail: user.emailAddress,
      unreadEmails: threads.length,
      eventsTodayMainCalendar: events.length,
      drafts: drafts.length,
    };

    return res.json(userInfo);
  } catch (error) {
    next(error);
  }
};

exports.createDraft = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const { to, subject, body } = req.body;

    const draft = new Draft(Nylas.with(user.accessToken));

    draft.from = [{ email: user.emailAddress }];
    draft.to = [{ email: to }];
    draft.subject = subject;
    draft.body = body;
    draft.replyToMessageId = replyToMessageId;
    const savedDraft = await draft.save();
    return res.json(savedDraft);
  } catch (error) {
    next(error);
  }
};

exports.readDrafts = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const nylas = Nylas.with(user.accessToken);

    const drafts = await nylas.drafts.list({ limit: 15, expanded: true });

    //sanitize the
    return res.json(drafts);
  } catch (error) {
    next(error);
  }
};

exports.sendDraft = async (req, res, next) => {
  console.log("send draft!!!");
  try {
    const user = res.locals.user;

    const { draftId } = req.query;

    console.log("send draft!!! draftId", draftId);
    const allDrafts = await Nylas.with(user.accessToken).drafts.list();

    await allDrafts.find((e) => e.id === draftId).send();
    return res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

exports.sendEmail = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.readEmails = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const nylas = Nylas.with(user.accessToken);

    const threads = await nylas.threads.list({ limit: 5, expanded: true });

    //sanitize the
    return res.json(threads);
  } catch (error) {
    next(error);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const nylas = Nylas.with(user.accessToken);

    const { id } = req.query;
    const message = await nylas.messages.find(id);

    return res.json(message);
  } catch (error) {
    next(error);
  }
};

exports.getFile = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const nylas = Nylas.with(user.accessToken);

    const { id } = req.query;
    const file = await nylas.files.find(id);

    // Files will be returned as a binary object
    const fileData = await file.download();
    return res.end(fileData?.body);
  } catch (error) {
    next(error);
  }
};

exports.readEvents = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.getReadEvents = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.readCalendars = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const calendars = await Nylas.with(user.accessToken)
      .calendars.list()
      .then((calendars) => calendars);

    return res.json(calendars);
  } catch (error) {
    next(error);
  }
};

exports.createEvents = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const { calendarId, title, description, startTime, endTime, participants } =
      req.body;

    if (!calendarId || !title || !startTime || !endTime) {
      return res.status(400).json({
        message:
          "Missing required fields: calendarId, title, starTime or endTime",
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
  } catch (error) {
    next(error);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const contacts = await Nylas.with(user.accessToken)
      .contacts.list()
      .then((contacts) => contacts);

    return res.json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const user = res.locals.user;

    const contact = await Nylas.with(user.accessToken)
      .contacts.find(id)
      .then((contact) => contact);

    return res.json(contact);
  } catch (error) {
    next(error);
  }
};
