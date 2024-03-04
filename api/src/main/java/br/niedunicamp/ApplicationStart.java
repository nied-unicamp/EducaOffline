package br.niedunicamp;

//#region Imports
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.niedunicamp.config.FileStorageConfig;
import br.niedunicamp.model.Permission;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.repository.PermissionRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.UserRepository;
//#endregion

//@EnableAspectJAutoProxy(proxyTargetClass=true)
@EntityScan(basePackageClasses = { ApplicationStart.class, Jsr310JpaConverters.class })
@EnableConfigurationProperties({ FileStorageConfig.class })
@EnableGlobalMethodSecurity(prePostEnabled = true)
@SpringBootApplication
public class ApplicationStart implements CommandLineRunner {

    public static final Logger logger = LoggerFactory.getLogger(ApplicationStart.class);

    public static void main(String[] args) {
        SpringApplication.run(ApplicationStart.class, args);
    }

    @Autowired
    public void authenticationManager(AuthenticationManagerBuilder builder, UserRepository userRepository,
            PermissionRepository permissionRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder)
            throws Exception {
        // Setup a default niedAdmin if db is empty
        if (permissionRepository.count() == 0) {

            // ------------------ Create Permission ----------------------------------- //
            List<Permission> availablePermissions = Arrays.asList("list_all_activities", "list_published_activities",
                    "create_activities", "delete_activities", "update_activities",

                    "get_all_evaluations", "create_activity_evaluation", "update_activity_evaluation",
                    "delete_activity_evaluation",

                    "list_all_submissions", "create_activity_submissions", "update_activity_submissions",

                    "create_course", "delete_course", "edit_course", "get_course_key", "edit_course_key",

                    "create_group", "delete_groups", "list_groups", "add_user_to_group", "enter_group",
                    "remove_user_from_group", "exit_from_group",

                    "list_materials", "create_material", "delete_material", "update_material",

                    "create_user", "delete_user", "edit_user",

                    "add_users_to_course", "list_course_users",
                    
                    "list_material_folder", "download_material_folder", "create_material_folder", "delete_material_folder", "update_material_folder",

                    "list_post_comments", "create_comment", "delete_post_comment", "update_post_comment",

                    "list_posts", "create_post", "delete_post", "update_post").stream().map(name -> {
                        Permission permission = new Permission();
                        permission.setName(name);

                        return permission;
                    }).collect(Collectors.toList());

            permissionRepository.saveAll(availablePermissions);

            // -------------------- Create Roles -------------------------------------- //

            // --------- ADMIN --------- //
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setPermissions(Arrays.asList("create_course", "delete_course", "edit_course", "get_course_key", "edit_course_key",

                    "create_user", "delete_user", "edit_user").stream().map(name -> permissionRepository.findByName(name))
                    .filter(item -> item != null).collect(Collectors.toList()));

            roleRepository.save(adminRole);

            // --------- STUDENT --------- //
            Role studentRole = new Role();
            studentRole.setName("STUDENT");
            studentRole.setPermissions(Arrays.asList("list_published_activities",

                    "create_activity_submissions", "update_activity_submissions",

                    "create_group", "list_groups", "enter_group", "exit_from_group",

                    "list_materials",

                    "list_material_folder", "download_material_folder",

                    "list_course_users",

                    "list_post_comments", "create_comment",

                    "list_posts", "create_post").stream().map(name -> permissionRepository.findByName(name))
                    .filter(item -> item != null).collect(Collectors.toList()));

            roleRepository.save(studentRole);

            // --------- TEACHER --------- //
            Role teacherRole = new Role();
            teacherRole.setName("TEACHER");
            teacherRole.setPermissions(Arrays.asList("list_all_activities", "list_published_activities",
                    "create_activities", "delete_activities", "update_activities",

                    "get_all_evaluations", "create_activity_evaluation", "update_activity_evaluation",
                    "delete_activity_evaluation",

                    "list_all_submissions",

                    "edit_course", "get_course_key", "edit_course_key",

                    "create_group", "delete_groups", "list_groups", "add_user_to_group", "remove_user_from_group",

                    "list_materials", "create_material", "delete_material", "update_material",
                    
                    "list_material_folder", "download_material_folder", "create_material_folder", "delete_material_folder", "update_material_folder",

                    "add_users_to_course", "list_course_users",

                    "list_post_comments", "create_comment", "delete_post_comment", "update_post_comment",

                    "list_posts", "create_post", "delete_post", "update_post").stream()
                    .map(name -> permissionRepository.findByName(name)).filter(item -> item != null)
                    .collect(Collectors.toList()));

            roleRepository.save(teacherRole);

            // // -------------------- Create the 1st ADMIN
            // -------------------------------------- //

            User user = new User();
            user.setName("niedAdmin");
            user.setEmail("admin_mail");
            user.setPassword(passwordEncoder.encode("password"));
            user.setIsAdmin(true);
            user.setAboutMe("About me :)");

            userRepository.save(user);
        }
    }

    @Override
    public void run(String... arg0) throws Exception {
        // userCourseCreation();
        // saveDataUserProfile();
    }
}
