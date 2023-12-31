const { default: Draft } = require('nylas/lib/models/draft');
const { default: Event } = require('nylas/lib/models/event');
const { default: Contact } = require('nylas/lib/models/contact');

const Nylas = require('nylas');
const { default: Calendar } = require('nylas/lib/models/calendar');

exports.greetingInfo = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const nylas = Nylas.with(user.accessToken);

		const [threads, calendars, drafts] = await Promise.all([
			nylas.threads.list({ unread: true }),
			nylas.calendars.list(),
			nylas.drafts.list({ limit: 150, expanded: true }),
		]);

		const primaryCalendar = calendars.find((calendar) => calendar.isPrimary);

		if (primaryCalendar) {
			//Seting up the date to  ISO 8601
			const todayStart = new Date();
			todayStart.setHours(0, 0, 0, 0);
			const startTimeISO = todayStart.toISOString();
			const todayEnd = new Date();
			todayEnd.setHours(23, 59, 59, 999);
			const endTimeISO = todayEnd.toISOString();

			const events = await nylas.events.list({
				calendar_id: primaryCalendar.id,
				starts_after: startTimeISO,
				ends_before: endTimeISO,
			});

			const userInfo = {
				userEmail: user.emailAddress,
				unreadEmails: threads.length,
				eventsTodayMainCalendar: events.length,
				drafts: drafts.length,
			};

			return res.json(userInfo);
		} else {
			return res.json({ message: 'No primary calendar found.' });
		}
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
	console.log('send draft!!!');
	try {
		const user = res.locals.user;

		const { draftId } = req.query;

		console.log('send draft!!! draftId', draftId);
		const allDrafts = await Nylas.with(user.accessToken).drafts.list();

		await allDrafts.find((e) => e.id === draftId).send();
		return res.json({ message: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.deleteDraft = async (req, res, next) => {
	try {
		const user = res.locals.user;

		const { draftId } = req.query;

		const response = await Nylas.with(user.accessToken).drafts.delete(draftId, {
			version: 0,
		});

		return res.json(response);
	} catch (error) {
		next(error);
	}
};

exports.readLabels = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const allLabels = await Nylas.with(user.accessToken).labels.list();
		return res.json(allLabels);
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

exports.updateEventById = async (req, res, next) => {
	try {
		const user = res.locals.user;
		const {
			id,
			notify_participants,
			title,
			description,
			startTime,
			endTime,
			participants,
		} = req.body;

		const nylas = await Nylas.with(user.accessToken);

		eventUpdated = await nylas.events.find(id);
		eventUpdated.visibility = 'public';

		//mergin objects for updating.
		updateEventIfValue(
			eventUpdated,
			notify_participants,
			'notify_participants'
		);
		updateEventIfValue(eventUpdated, title, 'title');
		updateEventIfValue(eventUpdated, description, 'description');
		updateEventIfValue(eventUpdated, startTime, 'startTime');
		updateEventIfValue(eventUpdated, endTime, 'endTime');
		updateEventIfValue(eventUpdated, participants, 'participants');

		const response = await eventUpdated.save();

		console.log('eventUpdated', response);
		return res.json(response);
	} catch (error) {
		next(error);
	}

	function updateEventIfValue(event, value, key) {
		if (value) {
			event[key] = value;
		}
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

exports.createCalendar = async (req, res, next) => {
	try {
		const user = res.locals.user;

		const { name, description, location, timezone } = req.body;

		const nylas = Nylas.with(user.accessToken);

		const newCalendar = new Calendar(nylas);

		newCalendar.name = name;
		newCalendar.location = location;
		newCalendar.description = description;
		newCalendar.timezone = timezone;

		const response = await newCalendar.save();
		return res.json(response);
	} catch (error) {
		next(error);
	}
};

exports.deleteCalendar = async (req, res, next) => {
	try {
		const user = res.locals.user;

		const { calendarId } = req.query;

		const response = await Nylas.with(user.accessToken).calendars.delete(
			calendarId
		);
		return res.json(response);
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
	} catch (error) {
		next(error);
	}
};

exports.createContact = async (req, res, next) => {
	try {
		const user = res.locals.user;

		const {
			givenName,
			middleName,
			surname,
			suffix,
			nickname,
			birthday,
			jobTitle,
			officeLocation,
			notes,
			pictureUrl,
			email,
		} = req.body;

		if (!givenName || !jobTitle || !birthday) {
			return res.status(400).json({
				message: 'Missing required fields: givenName, birthday, jobTitle',
			});
		}

		const nylas = Nylas.with(user.accessToken);

		const contact = new Contact(nylas);

		contact.givenName = givenName;
		contact.middleName = middleName;
		contact.surname = surname;

		contact.suffix = suffix;
		contact.nickname = nickname;
		contact.officeLocation = officeLocation;

		contact.notes = notes;
		contact.pictureUrl = pictureUrl;
		contact.email = email;

		await contact.save();

		return res.json(contact);
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

exports.deleteContactById = async (req, res, next) => {
	try {
		const user = res.locals.user;

		const { id } = req.body;

		const nylas = await Nylas.with(user.accessToken);

		contact = nylas.contacts.delete(id);

		console.log('contactToDelete', contact);
		return res.json(contact);
	} catch (error) {
		next(error);
	}
};
