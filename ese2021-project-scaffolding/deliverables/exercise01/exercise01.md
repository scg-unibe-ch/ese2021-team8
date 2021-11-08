# Task 1: User stories

## Functional:
1. As a moderator, I want to remove inappropriate posts/ban misbehaving users so that the platform stays a friendly 
   and controlled place.
6. As a user, I want to reset my password in case I have forgotten it, so that I am able to get access to my user 
   profile again.
9. As a system administrator, I want to grant a user the role of a moderator, so that he can help maintaining 
   the platform a friendly place.
6. As a user, I want the possibility to post a post, edit a posts and delete a post.
9. As a user, I want see other post.
6. As an Admin, I want to put Products in the Shop, with a title, image, description and a price.
9. As an Admin, I need the option to see the Orders and changed the Status.
6. As a user, I want see Products in the shop and "browse" the category. 
9. As a user, I want to cancel a order. 


## Non-functional:
1. As a user of the website, I want it’s usage to be so intuitive that I do not have to read a manual or forum posts.
2. As a user, I don’t want my personal profile be secure, so that nobody who I don’t know is able to access sensitive 
   data like real name, address or credit card number.
3. As a user, I want to access the website from different platforms such as PC, smartphone or tablet, so that I can be 
   connected to the community all day.

#Task 2:

See: [Use case diagram](Authentification_Feature_Use_Case.pdf)

#Task 3: Authentification Feature Use Case Description

## Disclaimer
The database is a seperate actor, because the system is explicitely only the authentification feature. 

## Login
This use case contains two sub-use cases. The member enters his data, while the database checks the inputs. If both are correct,
the login is successful. This means the database must update the status of the user to online/active.
This must only be done if other users should see that this user is only (friends-feature), else the database must not be updated.

## Enter password
One of the two sub-use cases of login. The member must enter his password, while the database checks whether the password is correct or not.

## Enter username
The other of the two sub-use cases of login. The member must enter his username, while the database checks whether this member exists.

## Change password
Once logged in, the member should be able to change his password. The database must be updated accordingly with the new password.

## Logout
The member must be able to log out. This can only be done if the user is logged in. Furthermore, the database must be updated with the status of the member.

## Resetting password
If the member has forgotten his password, he must be able to get a new one. An administrator (automated or manual) must be able to reset the password
and contact the member. The database must be updated with the reset.

## Register
A guest can register himself by entering his data (username, password, etc.). The database has to save the inputs. The guest then becomes a member.


# Task 5

## Admin create a new product "post"

An Admin need to set a Product in the Shop. He choice a category with a title, image, description and a Price. 

## Admin deliver A product

## Fan buy a product 
A fan can see the product and buy it in the Shop. He can "browse" it with the category. 

## Fan cancel a order
A fan can cancle 


