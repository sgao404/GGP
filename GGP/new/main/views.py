from flask import Flask, render_template, flash, session, url_for, request, redirect, abort

@main.route('/')
def homepage():
    return render_template("index.html") 