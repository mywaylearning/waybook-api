# Explorations 

TOC

- [spec](#spec)
- [toml files](#toml-files)
- [database](#database)
- [terminology](#terminology)

## spec
[spec](https://docs.google.com/document/d/1cLwquaVtb9NOPG20x0buPYHu64H72r72bcLoLzISdxc/edit)

Explorations are survey’s, quizzes, test, puzzles, games, that yield knowledge or insights about oneself, how they interact with others, and how they view the world.
The result of an exploration is a #discovery.

Only **completed** explorations will contain computed result.

## toml files

```
[meta]
name = "The Big 5 Personality Inventory"
version= '1.0.0'
category="personality" # predefined category
pattern="multiple-choices" # predefined pattern
slug="big-5-personality-inventory" # auto-generated from name
description = """
Find out where you fall on each of the dimensions of \
openness, conscientiousness, extraversion, agreeableness, and neuroticism.
"""

image = "http://res.cloudinary.com/myway-learning-company/image/upload/v1402449348/yyzakjmvpnnxd9sqn6bn.jpg"

[analyzer]
enabled = true

[[answers]]
text = "Strongly Disagree"
value = 1

[[answers]]
text = "Disagree"
value = 2

[questions]
 1  = 'I am talkative'
 2  = 'I tend to find fault with others'
```

## Database

Using [nodejs toml parser](https://github.com/jakwings/toml-j0.4) get each file content as json object.

```
{
  "name": "The Big 5 Personality Inventory",
  "version": "1.0.0",
  "category": "personality",
  "pattern": "multiple-choices",
  "slug": "big-5-personality-inventory",
  "description": "Find out where you fall on each of the dimensions of openness, conscientiousness, extraversion, agreeableness, and neuroticism.\n",
  "image": "http://res.cloudinary.com/myway-learning-company/image/upload/v1402449348/yyzakjmvpnnxd9sqn6bn.jpg"
  "analyzer": {
    "enabled": true
  },
  "answers": [
    {
      "text": "Strongly Disagree",
      "value": 1
    },
    {
      "text": "Disagree",
      "value": 2
    }
  ],
  "questions": {
    "1": "I am talkative",
    "2": "I tend to find fault with others"
  }
}
```

### Tables

- questions:
    - question
    - number(order)
    - explorationId

- answers:
    - question(number)
    - explorationId
    - answer

- explorations: 
  - name
  - version
  - category
  - slug
  - image
  - description
  
