const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const login_router = require('express').Router;
const User = require('../models/user');