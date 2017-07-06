# content management system
import os, sys
import random

def Content():

    TOPIC_DICT = {
    "Basics":[
        ["Introduction to Python","/introduction-to-python-programming/"],
	["Print functions and Strings","/python-tutorial-print-function-strings/"],
	["Math basics with Python 3","/math-basics-python-3-beginner-tutorial/"]
    ],
    "Web Dev":[
    ]
    }

    return TOPIC_DICT

def gen_port():
    path = '/var/www/GPApp/GPApp/static/images/bingimg/'
    imgs = os.listdir(path)
    keymap = ['1','2','3','4','5','6','Q','W','E','R','T','Y','A','S','D','F','G','H','Z','X','C','V','B','N']
    newimgs = random.sample(imgs,24)
    collection = zip(keymap, newimgs)
    return collection

def gen_tooltip():

    TIP_DICT = {
    "Email":"What is your current email?",
    "Username":"Usernames must have only letters, numbers, dots or underscores",
    "Security_lv":"Better memory comes with better secuiry!",
    "Clickpoint":"<ul><li>Use the default image or upload your own image</li>\
        <li>Hit Start Selection button and click 3 different locations on the image</li>\
        <li>Use Reset button to start over</li></ul>",
    "Portfolio":"<ul><li>Click image for larger view</li>\
        <li>Hit Start Selection button and press the corresponding key to \
        select the image</li></ul>"
    }
    
    return TIP_DICT

