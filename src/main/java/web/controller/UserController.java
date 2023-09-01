package web.controller;


import java.security.Principal;
import java.util.Optional;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.models.User;
import web.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping(path = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Optional<User>> getAuthUser(
      @CurrentSecurityContext(expression = "authentication") Principal principal) {
    Optional<User> user = userService.getUserByUsername(principal.getName());
    return ResponseEntity.ok(user);
  }
}
