# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
user = User.new username: 'admin002',nickname: '我是管理员', password: 'admin002',password_confirmation: 'admin002', email: '137372247@163.com',credits: 999, admin: true, activation: 1
puts user.save! ? 'add user success.' : 'add user fail!'