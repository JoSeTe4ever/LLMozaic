import os
import json
import io
import uuid


class MockDb:
    """
    A simple implementation of a mock database that writes and reads data (JSON) to/from a file.

    ```
    Attributes
    ----------
        filename : str
            The name of the file to be used as the mock database.

    Methods
    -------
        get_JSON_records()
            Reads a JSON file from disk and returns its contents as a Python object.
        find_user(id, email_address=None)
            Find a user record in JSON records based on email address or id.
        update_user(id, payload)
            Update the user record with the given id in the JSON file.
        create_user(payload)
            Create a new user record in the JSON file.
        create_or_update_user(email_address, payload)
            Create a new user record in the JSON file if the user does not exist. If the user exists, update the user record.
    """

    def __init__(self, filename):
        """
        The constructor initializes the filename attribute with the value passed as an argument.
        It then checks if the file exists and has the required permissions. If the file doesn't exist, it creates the file.
        In case the file name is not provided, the file doesn't have the required permissions, or the file could not successfully be created, it raises an exception and exits.

        Parmeters
        ---------
            filename : str
                The name of the file to be used as the mock database.
        """
        try:
            if not filename:
                raise Exception('NO_FILENAME')
            self.filename = filename

            if not os.access(self.filename, os.F_OK):
                print('mock_db//creating file...')
                open(self.filename, 'w').write('[]')
                print('mock_db//db file created')
            elif not os.access(self.filename,  os.R_OK or os.W_OK):
                raise Exception('NO_PERMISSION')

            print('mock_db//db file exists and permissions OK')
        except Exception as err:
            print('mock_db//{}'.format(err.__str__()))
            print('exiting...')

    def get_JSON_records(self):
        """
        Reads a JSON file from disk and returns its contents as a Python object.

            Returns:
                dict: A dictionary containing the JSON records.
        """
        with io.open(self.filename, 'r', encoding='utf-8') as f:
            json_records = f.read()

        return json.loads(json_records)

    def find_user(self, id, email_address=None):
        """
        Find a user record in JSON records based on email address or id.

            Parameters:
                id (string): ID of the user to search for.
                emailAddress (string): Email address of the user to search for.

            Returns:     
                dict: A dictionary containing the user record, or None if no matching record is found.
        """
        json_records = self.get_JSON_records()
        return next((r for r in json_records if r['email_address'] == email_address or r['id'] == id), None)

    def update_user(self, id, payload):
        """
        Update the user record with the given id in the JSON file.

            Parameters:
                id (int): the id of the user record to be updated
                payload (dict): the updated information for the user record

            Returns:
                dict: the updated user record

            Raises:
                Exception: if the record with the given id is not found in the JSON file
        """
        json_records = self.get_JSON_records()

        idx = next((i for i, r in enumerate(
            json_records) if r['id'] == id), None)
        if idx is None:
            raise Exception('Record not found')

        json_records[idx] = {**json_records[idx], **payload}

        with io.open(self.filename, 'w', encoding='utf-8') as f:
            f.write(json.dumps(json_records, ensure_ascii=False))

        return json_records[idx]

    def create_user(self, payload):
        """
        Create a new user record in the JSON file.

            Parameters:
                payload (dict): the information for the new user record

            Returns:
                dict: the created user record
        """
        json_records = self.get_JSON_records()

        user = {
            'id': str(uuid.uuid4()),
            **payload
        }

        json_records.append(user)

        with io.open(self.filename, 'w', encoding='utf-8') as f:
            f.write(json.dumps(json_records, ensure_ascii=False))

        return user

    def create_or_update_user(self, id, attributes):
        """
        Create a new user record or update an existing one in the JSON file.
        The user is identified by either the id or email_address in the attributes.

            Parameters:
                id (uuidv4): the id of the user to be created or updated
                attributes (dict): the information for the user record

            Returns:
                dict: the created or updated user record
        """
        record = self.find_user(id, attributes['email_address'])
        if record:
            return self.update_user(record['id'], attributes)
        else:
            return self.create_user(attributes)


db = MockDb('datastore.json')
