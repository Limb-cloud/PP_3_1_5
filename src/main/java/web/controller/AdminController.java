package web.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.models.Role;
import web.models.User;
import web.service.RoleService;
import web.service.UserService;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

  private final UserService userService;
  private final RoleService roleService;

  private static final String REDIRECT_MAIN_PAGE = "redirect:/admin";

  @Autowired
  public AdminController(UserService userService, RoleService roleService) {
    this.userService = userService;
    this.roleService = roleService;
  }

  @GetMapping("/users")
  public ResponseEntity<List<User>> getUsers() {
    return new ResponseEntity<>(userService.listUsers(), HttpStatus.OK);
  }

  @GetMapping(value = "/user/{id}")
  public ResponseEntity<User> getUser(@PathVariable("id") long id) {
    return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
  }

  @GetMapping("/roles")
  public ResponseEntity<List<Role>> getRoles() {
    return new ResponseEntity<>(roleService.listRoles(), HttpStatus.OK);
  }

  @PostMapping("/user")
  public ResponseEntity<HttpStatus> addUser(@RequestBody User user,
      @RequestParam("roles") String role) {
    userService.addUser(user, role);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PutMapping(value = "/user/{id}")
  public ResponseEntity<HttpStatus> updateUser(@RequestBody User user,
      @RequestParam("roles") String role) {
    userService.updateUser(user, role);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping(value = "/{id}")
  public ResponseEntity<HttpStatus> removeUser(@PathVariable("id") long id) {
    userService.removeUser(id);
    return ResponseEntity.ok(HttpStatus.OK);
  }
}
