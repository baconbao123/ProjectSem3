//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace AuthenticationJWT.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ActionController : ControllerBase
//    {
//        // Static list to simulate database of users.
//        private static List<User> _users = new List<User>
//        {
//            new User { Id = 1, Username = "admin", Email = "admin@example.com" },
//            new User { Id = 2, Username = "user", Email = "user@example.com" },
//            new User { Id = 3, Username = "test", Email="test@example.com" }
//        };

//        // GET method to retrieve all users.
//        [HttpGet]
//        //To secure the endpoints with JWT authentication, we need to apply the [Authorize] attribute
//        [Authorize]
//        public ActionResult<List<User>> GetAllUsers()
//        {
//            // Return the static list of users.
//            return _users;
//        }

//        // GET method with a parameter to retrieve a specific user by their ID.
//        [HttpGet("{id}")]
//        [Authorize]
//        public ActionResult<User> GetUser(int id)
//        {
//            // Searches the list for a user with the specified ID.
//            var user = _users.FirstOrDefault(u => u.Id == id);
//            // If no user is found, return a 404 Not Found response.
//            if (user == null)
//                return NotFound();
//            // If found, return the user.
//            return user;
//        }

//        // POST method to create a new user.
//        [HttpPost]
//        [Authorize]
//        public ActionResult<User> CreateUser([FromBody] User user)
//        {
//            // Adds the new user to the list.
//            _users.Add(user);
//            // Return a response with the location of the newly created user.
//            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
//        }

//        // PUT method to update an existing user.
//        [HttpPut("{id}")]
//        [Authorize]
//        public ActionResult<User> UpdateUser(int id, [FromBody] User user)
//        {
//            // Find the index of the user in the list.
//            var index = _users.FindIndex(u => u.Id == id);
//            // If no user is found at that index, return a 404 Not Found.
//            if (index == -1)
//                return NotFound();

//            // Update the user at the specific index.
//            _users[index] = user;
//            // Return a 204 No Content response, indicating the update was successful.
//            return NoContent();
//        }

//        // DELETE method to remove a user by ID.
//        [HttpDelete("{id}")]
//        [Authorize]
//        public IActionResult DeleteUser(int id)
//        {
//            // Find the index of the user to be deleted.
//            var index = _users.FindIndex(u => u.Id == id);
//            // If no user is found at that index, return a 404 Not Found.
//            if (index == -1)
//                return NotFound();

//            // Remove the user from the list.
//            _users.RemoveAt(index);
//            // Return a 204 No Content response, indicating the deletion was successful.
//            return NoContent();
//        }
//    }

//    // Definition of the User model used in the controller.
//    public class User
//    {
//        public int Id { get; set; }
//        public string Username { get; set; }
//        public string Email { get; set; }
//    }
//}
