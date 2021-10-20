#CRC Card


##User
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>has unique username</li>
    <li>can log in
    <li>can make posts</li>
    <li>can up/downvote posts (if user is an admin)</li>
    <li>has a user profile</li>
    <li>can be an Admin</li>
</td>
<td>
    <li>Post</li>
    <li>Board</li>
</td>
</tr>

</table>

##Board
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Display posts</li>
    <li>Sort posts</li>
    <li>Updates when new post is created</li>
</td>
<td>
    <li>User</li>
    <li>Post</li>
</td>
</tr>

</table>

##Post
<table>
<tr> 
    <th>Responsibilities</th>
    <th>Collaborators</th>
</tr>
<tr>
<td>
    <li>Identify creator</li>
    <li>Display content</li>
    <li>Has a title</li>
    <li>Can include an image</li>
    <li>Is part of the board</li>
    <li>Has a category</li>
    <li>Can be deleted or edited by creator or an admin</li>
    
</td>
<td>
    <li>User</li>
    <li>Board</li>
</td>
</tr>

</table>