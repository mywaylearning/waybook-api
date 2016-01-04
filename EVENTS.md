# Events

Events are designed to track information associated to an user

There are the following types of events we'll track:

- UI (dealt with elsewhere)
- Transactional
- Threshhold


## Table

```
+-----------+------------------+------+-----+-------------------+----------------+
| Field     | Type             | Null | Key | Default           | Extra          |
+-----------+------------------+------+-----+-------------------+----------------+
| id        | int(11) unsigned | NO   | PRI | NULL              | auto_increment |
| modelName | varchar(128)     | NO   |     | NULL              |                |
| modelId   | int(11)          | YES  |     | NULL              |                |
| action    | varchar(50)      | NO   |     | NULL              |                |
| object    | text             | YES  |     | NULL              |                |
| createdAt | timestamp        | NO   |     | CURRENT_TIMESTAMP |                |
+-----------+------------------+------+-----+-------------------+----------------+
```

### Fields

- id _unique identifier_
- modelName _model name instance, like: Contact or Post_
- modelId _instance id, used to query changes associated to a single model_
- action _string based action like: CREATE or UPDATE_
- object _instance itself, used to compare changes during the time_
- createdAt _timestamp related to create time_


### Tracking Events

- Added

	- An user adds a comment
  - An user updates a comment
  - An user adds a contact
  - An user updates a contact
  
- To be added( these are sugggestions )

	- Please see the list in this task: https://app.asana.com/0/39954499005655/44236999680222
  - An user add a post
  - An user updates a post
  - An user deletes a post
  - An user share a post
  - An user re-share a post
  - An user completes a task
  - An user finish an exploration
  - An user updates their profile


Events are only mean to be used **on the api** there's no endpoint associated to the public interface.
