package com.example.sem_test.User;

import com.example.sem_test.Image.Image;
import com.example.sem_test.Image.ImageService;
import com.example.sem_test.Tag.Tag;
import com.example.sem_test.Tag.TagService;
import com.example.sem_test.Task.Task;
import com.example.sem_test.Task.TaskService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.tools.FileObject;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.*;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.output.Format;
import org.jdom2.output.XMLOutputter;

@RestController
@CrossOrigin
public class UserController {
    private final UserService userService;
    private final ImageService imageService;
    private final TaskService taskService;
    private final TagService tagService;

    private int login_user;
    private List<String> image_list;
    private int see_task_id;
    private int task_in_mark;

    private List<Image> mark_image_list;
    private int mark_image_num;
    private int image_in_marking;

    private static String image_path = "C:/Users/12944/Desktop/BS参考项目/React_Test/src/image";
    private static String download_path = "C:/Users/12944/Desktop/数据集";
    private static String folder = "image";

    private List<String> base64_img_list;

    @Autowired
    public UserController(UserService userService, ImageService imageService, TaskService taskService, TagService tagService) {
        this.userService = userService;
        this.imageService = imageService;
        this.taskService = taskService;
        this.tagService = tagService;
        login_user = -1;
        see_task_id = -1;
        task_in_mark = -1;
    }


    @RequestMapping("/register")
    @ResponseBody
    public Map<String, String> Register(@RequestBody Map<String, String> map) {
        String name = map.get("name");
        String password = map.get("password");
        String email = map.get("email");

        Map<String, String> unique_map = new HashMap<>();
        if(userService.FindByName(name)!=null)
            unique_map.put("unique", "name_false");
        else if(userService.FindByEmail(email)!=null)
            unique_map.put("unique", "email_false");
        else
        {
            unique_map.put("unique", "true");
            User new_user = new User(name, password, email);
            userService.Register(new_user);
        }

        return unique_map;
    }

    @RequestMapping("/login")
    @ResponseBody
    public Map<String, String> Login(@RequestBody Map<String, String> map) {
        String name = map.get("name");
        String password = map.get("password");

        User u = userService.LoginCheck(name, password);
        Map<String, String> found_map = new HashMap<>();
        if (u != null) {
            login_user = u.getId();
            found_map.put("result", "success");
        } else {
            found_map.put("result", "fail");
        }
        System.out.println(login_user);
        return found_map;
    }

    @RequestMapping("/user_info")
    public Map<String, String> Get_User_Info() {
        User u = userService.FindById(login_user);
        Map<String, String> info_map = new HashMap<>();
        if (u != null) {
            info_map.put("username", u.getName());
            info_map.put("email", u.getEmail());
        } else {
            info_map.put("username", "未登录");
            info_map.put("email", "未登录");
        }
        return info_map;
    }

    @RequestMapping("/exit")
    public void ExitLogin() {
        login_user = -1;
    }

    @RequestMapping("/upload_image")
    public void UpLoadImage(@RequestParam("files") MultipartFile[] files) throws IOException {
        if (login_user == -1)
            return;

        image_list = new ArrayList<>();
        for (MultipartFile file : files) {
            file.transferTo(new File(image_path + "/" + file.getOriginalFilename()));
            image_list.add(file.getOriginalFilename());
        }
    }

    @RequestMapping("/create_task")
    public void CreateTask(@RequestBody Map<String, String> map) {
        if (login_user == -1)
            return;

        String name = map.get("name");
        String requirement = map.get("requirement");

        Task t = taskService.SaveTask(login_user, name, requirement);

        for (String s : image_list)
            imageService.SaveImage(s, t.getId());
    }

    @RequestMapping("/all_task")
    public List<Map<String, String>> AllTask() {
        if (login_user == -1)
            return null;

        List<Map<String, String>> result_list = new ArrayList<>();
        List<Task> task_list = taskService.FindAllTask();
        for (Task t : task_list) {
            String image_name = imageService.FindByTaskid(t.getId()).get(0).getName();
            String creator = userService.FindById(t.getCreatorid()).getName();
            Map<String, String> task_map = new HashMap<>();
            task_map.put("image_name", image_name);
            task_map.put("task_name", t.getName());
            task_map.put("creator", creator);
            task_map.put("is_received", t.isIsreceived() ? "true" : "false");
            task_map.put("is_finished", t.isIsfinished() ? "true" : "false");
            task_map.put("task_id", String.valueOf(t.getId()));
            result_list.add(task_map);
        }

        return result_list;
    }

    @RequestMapping("/see_task")
    public void SeeTask(@RequestBody Map<String, String> map) {
        String id_str = map.get("taskid");
        see_task_id = Integer.parseInt(id_str);
        System.out.println("see_task_id:"+see_task_id);
    }

    @RequestMapping("/task_info")
    public List<Map<String, String>> TaskInfo() {
        if (login_user == -1)
            return null;

        List<Map<String, String>> result_list = new ArrayList<>();

        Task t = taskService.FindById(see_task_id);
        Map<String, String> task_map = new HashMap<>();
        task_map.put("task_name", t.getName());
        task_map.put("task_requirement", t.getRequirement());
        task_map.put("creator_name", userService.FindById(t.getCreatorid()).getName());
        task_map.put("is_received", t.isIsreceived() ? "true" : "false");
        result_list.add(task_map);

        List<Image> image_list = imageService.FindByTaskid(see_task_id);
        for(Image i: image_list){
            Map<String, String> image_map = new HashMap<>();
            image_map.put("image_name", i.getName());
            result_list.add(image_map);
        }

        return result_list;
    }

    @RequestMapping("/receive_task")
    public Map<String, String> ReceiveTask() {
        if(login_user!=-1)
        {
            Map<String, String> self_map = new HashMap<>();
            if(taskService.FindById(see_task_id).getCreatorid()!=login_user)
            {
                taskService.ReceiveTask(see_task_id, login_user);
                self_map.put("self", "false");
            }
            else
                self_map.put("self", "true");
            return self_map;
        }
        else
            return null;
    }

    @RequestMapping("/my_task")
    public List<Map<String, String>> MyTask() {
        if (login_user == -1)
            return null;

        List<Map<String, String>> result_list = new ArrayList<>();
        List<Task> task_list = taskService.FindByReceiverid(login_user);
        for (Task t : task_list) {
            String image_name = imageService.FindByTaskid(t.getId()).get(0).getName();
            String creator = userService.FindById(t.getCreatorid()).getName();
            Map<String, String> task_map = new HashMap<>();
            task_map.put("image_name", image_name);
            task_map.put("task_name", t.getName());
            task_map.put("creator", creator);
            task_map.put("is_received", t.isIsreceived() ? "true" : "false");
            task_map.put("is_finished", t.isIsfinished() ? "true" : "false");
            task_map.put("task_id", String.valueOf(t.getId()));
            result_list.add(task_map);
        }

        return result_list;
    }

    @RequestMapping("/my_create_task")
    public List<Map<String, String>> MyCreateTask() {
        if (login_user == -1)
            return null;

        List<Map<String, String>> result_list = new ArrayList<>();
        List<Task> task_list = taskService.FindByCreatorid(login_user);
        for (Task t : task_list) {
            String image_name = imageService.FindByTaskid(t.getId()).get(0).getName();
            String creator = userService.FindById(t.getCreatorid()).getName();
            Map<String, String> task_map = new HashMap<>();
            task_map.put("image_name", image_name);
            task_map.put("task_name", t.getName());
            task_map.put("creator", creator);
            task_map.put("is_received", t.isIsreceived() ? "true" : "false");
            task_map.put("is_finished", t.isIsfinished() ? "true" : "false");
            task_map.put("task_id", String.valueOf(t.getId()));
            result_list.add(task_map);
        }

        return result_list;
    }

    @RequestMapping("/begin_mark")
    public void BeginMark(@RequestBody Map<String, String> map) {
        String id_str = map.get("taskid");
        task_in_mark = Integer.parseInt(id_str);
        System.out.println("begin_task_id:"+task_in_mark);

        mark_image_list = imageService.FindByTaskid(task_in_mark);
        image_in_marking = 0;
        mark_image_num = 0;
        for(Image i: mark_image_list)
            mark_image_num++;
    }

    @RequestMapping("/sub_image_num")
    public void SubImageNum(){
        if(image_in_marking>0)
            image_in_marking--;
    }

    @RequestMapping("/add_image_num")
    public void AddImageNum(){
        if(image_in_marking<mark_image_num-1)
            image_in_marking++;
    }

    @RequestMapping("/marking_get_info")
    public Map<String, String> MarkingGetInfo(){
        Map<String, String> marking_map = new HashMap<>();
        marking_map.put("image_name", mark_image_list.get(image_in_marking).getName());
        marking_map.put("task_name", taskService.FindById(task_in_mark).getName());
        marking_map.put("task_requirement", taskService.FindById(task_in_mark).getRequirement());
        marking_map.put("creator", userService.FindById(taskService.FindById(task_in_mark).getCreatorid()).getName());
        marking_map.put("receiver", userService.FindById(taskService.FindById(task_in_mark).getReceiverid()).getName());
        return marking_map;
    }

    @RequestMapping("/add_tag")
    public void AddTag(@RequestBody Map<String, String> map){
        if(login_user==-1)
            return;

        String uuid = map.get("uuid");
        String name = map.get("name");
        String x = map.get("x");
        String y = map.get("y");
        String xm = map.get("xm");
        String ym = map.get("ym");

        tagService.SaveTag(uuid, name, x, y, xm, ym, task_in_mark, mark_image_list.get(image_in_marking).getId());
    }

    @RequestMapping("/delete_tag")
    public void DeleteTag(@RequestBody Map<String, String> map){
        if(login_user==-1)
            return;

        String uuid = map.get("uuid");
        String name = map.get("name");
        String x = map.get("x");
        String y = map.get("y");
        String xm = map.get("xm");
        String ym = map.get("ym");

        tagService.DeleteTag(uuid);
    }

    @RequestMapping("/change_tag")
    public void ChangeTag(@RequestBody Map<String, String> map){
        if(login_user==-1)
            return;

        String uuid = map.get("uuid");
        String name = map.get("name");
        String x = map.get("x");
        String y = map.get("y");
        String xm = map.get("xm");
        String ym = map.get("ym");

        tagService.ChangeTag(uuid, name, x, y, xm, ym);
    }

    @RequestMapping("/mark_initial_data")
    public List<Map<String, String>> MarkInitialData() {
        if (login_user == -1)
            return null;

        List<Map<String, String>> result_list = new ArrayList<>();
        List<Tag> tag_list = tagService.FindByImageid(mark_image_list.get(image_in_marking).getId());
        System.out.println("image id:"+image_in_marking);
        System.out.println("tag list:");
        System.out.println(tag_list);
        for(Tag t: tag_list){
            Map<String, String> tag_map = new HashMap<>();
            tag_map.put("uuid", t.getUuid());
            tag_map.put("tagName", t.getName());
            tag_map.put("x", t.getX());
            tag_map.put("y", t.getY());
            tag_map.put("xm", t.getXm());
            tag_map.put("ym", t.getYm());
            result_list.add(tag_map);
        }
        System.out.println("result list:");
        System.out.println(result_list);

        return result_list;
    }

    @RequestMapping("/submit_task")
    public void SubmitTask(){
        taskService.SubmitTask(task_in_mark);
    }

    public static boolean deleteFile(File dirFile) {
        if (!dirFile.exists()) {
            return false;
        }

        if (dirFile.isFile()) {
            return dirFile.delete();
        } else {

            for (File file : dirFile.listFiles()) {
                deleteFile(file);
            }
        }

        return dirFile.delete();
    }

    @RequestMapping("/download_PASCALVOC")
    public Map<String, String> DownloadPASCALVOC() throws IOException {
        String PASCALVOC_path = download_path+"/"+taskService.FindById(task_in_mark).getName()+"_PASCAL_VOC";
        String JPEGImages_path = PASCALVOC_path+"/JPEGImages";
        String Annotations_path = PASCALVOC_path+"/Annotations";
        String ImageSets_path = PASCALVOC_path+"/ImageSets";
        File PASCALVOC_dir = new File(PASCALVOC_path);
        File JPEGImages_dir = new File(JPEGImages_path);
        File Annotations_dir = new File(Annotations_path);
        File ImageSets_dir = new File(ImageSets_path);
        if(PASCALVOC_dir.exists())
            deleteFile(PASCALVOC_dir);
        PASCALVOC_dir.mkdir();
        JPEGImages_dir.mkdir();
        Annotations_dir.mkdir();
        ImageSets_dir.mkdir();

        //创建ImageSets下train.txt文件
        File train_file = new File(ImageSets_path+"/train.txt");
        train_file.createNewFile();

        for(Image i: mark_image_list) {
            int width = 0;
            int height = 0;
            int depth = 0;
            File oldimage = new File(image_path + "/" + i.getName());
            InputStream inStream = new FileInputStream(oldimage); //读入原文件
            BufferedImage src = javax.imageio.ImageIO.read(inStream);
            width = src.getWidth();
            height = src.getHeight();
            depth = 3;

            //JPEGImages里写入原图片
            File oldpaths = new File(image_path+"/"+i.getName());
            File newpaths = new File(JPEGImages_path+"/"+i.getName());
            Files.copy(oldpaths.toPath(), newpaths.toPath());

            //Annotations里写入xml文件
            Element root = new Element("annotation");
            Document document = new Document(root);
            Element folder_e = new Element("folder");
            folder_e.setText(folder);
            Element filename_e = new Element("filename");
            filename_e.setText(i.getName());
            Element path_e = new Element("path");
            path_e.setText(image_path+"/"+i.getName());
            Element source_e = new Element("source");
            Element database_e = new Element("database");
            database_e.setText("Unknown");
            source_e.addContent(database_e);
            Element size_e = new Element("size");
            Element width_e = new Element("width");
            width_e.setText(String.valueOf(width));
            Element height_e = new Element("height");
            height_e.setText(String.valueOf(height));
            Element depth_e = new Element("depth");
            depth_e.setText(String.valueOf(depth));
            size_e.addContent(width_e);
            size_e.addContent(height_e);
            size_e.addContent(depth_e);
            Element segmented_e = new Element("segmented");
            segmented_e.setText(String.valueOf(0));
            root.addContent(folder_e);
            root.addContent(filename_e);
            root.addContent(path_e);
            root.addContent(source_e);
            root.addContent(size_e);
            root.addContent(segmented_e);

            List<Tag> tag_list = tagService.FindByImageid(i.getId());
            for(Tag t: tag_list){
                double xmin = Double.parseDouble(t.getX().substring(0,t.getX().length()-1));
                xmin = xmin/100*width;
                double ymin = Double.parseDouble(t.getY().substring(0,t.getY().length()-1));
                ymin = ymin/100*height;
                double xmax = Double.parseDouble(t.getXm().substring(0,t.getXm().length()-1));
                xmax = xmax/100*width;
                double ymax = Double.parseDouble(t.getYm().substring(0,t.getYm().length()-1));
                ymax = ymax/100*height;

                Element object_e = new Element("object");
                Element name_e = new Element("name");
                name_e.setText(t.getName());
                Element pose_e = new Element("pose");
                pose_e.setText("Unspecified");
                Element truncated_e = new Element("truncated");
                truncated_e.setText(String.valueOf(0));
                Element difficult_e = new Element("difficult");
                difficult_e.setText(String.valueOf(0));
                Element bndbox_e = new Element("bndbox");
                Element xmin_e = new Element("xmin");
                xmin_e.setText(String.valueOf((int)xmin));
                Element ymin_e = new Element("ymin");
                ymin_e.setText(String.valueOf((int)ymin));
                Element xmax_e = new Element("xmax");
                xmax_e.setText(String.valueOf((int)xmax));
                Element ymax_e = new Element("ymax");
                ymax_e.setText(String.valueOf((int)ymax));
                bndbox_e.addContent(xmin_e);
                bndbox_e.addContent(ymin_e);
                bndbox_e.addContent(xmax_e);
                bndbox_e.addContent(ymax_e);
                object_e.addContent(name_e);
                object_e.addContent(pose_e);
                object_e.addContent(truncated_e);
                object_e.addContent(difficult_e);
                object_e.addContent(bndbox_e);
                root.addContent(object_e);
            }

            Format format = Format.getCompactFormat();
            format.setIndent("  ");
            format.setEncoding("UTF-8");
            XMLOutputter outputer = new XMLOutputter(format);
            File xml_file = new File(Annotations_path+"/"+i.getName().substring(0,i.getName().lastIndexOf("."))+".xml");
            outputer.output(document, new FileOutputStream(xml_file));

            //所有图片名默认写入train.txt文件
            BufferedWriter bw = new BufferedWriter(new FileWriter(ImageSets_path+"/train.txt",true));
            bw.write(i.getName().substring(0,i.getName().lastIndexOf("."))+"\r\n");
            bw.close();
        }

        Map<String, String> path_map = new HashMap<>();
        path_map.put("download_path", download_path);
        return path_map;
    }

    @RequestMapping("/download_COCO")
    public Map<String, String> DownloadCOCO() throws IOException {
        String COCO_path = download_path+"/"+taskService.FindById(task_in_mark).getName()+"_COCO";
        String annotations_path = COCO_path+"/annotations";
        String train_path = COCO_path+"/train";
        File COCO_dir = new File(COCO_path);
        File annotations_dir = new File(annotations_path);
        File train_dir = new File(train_path);
        if(COCO_dir.exists())
            deleteFile(COCO_dir);
        COCO_dir.mkdir();
        annotations_dir.mkdir();
        train_dir.mkdir();

        //制作train，写入原图片
        for(Image i: mark_image_list) {
            File oldpaths = new File(image_path + "/" + i.getName());
            File newpaths = new File(train_path + "/" + i.getName());
            Files.copy(oldpaths.toPath(), newpaths.toPath());
        }

        //制作json
        Map<String, Object> final_json = new HashMap<>();
        final_json.put("info", "");
        final_json.put("licenses", "");

        //images
        List<Map<String, Object>> images_list = new ArrayList<>();
        for(Image i: mark_image_list) {
            int width = 0;
            int height = 0;
            File oldimage = new File(image_path + "/" + i.getName());
            InputStream inStream = new FileInputStream(oldimage); //读入原文件
            BufferedImage src = javax.imageio.ImageIO.read(inStream);
            width = src.getWidth();
            height = src.getHeight();

            Map<String, Object> img_json = new HashMap<>();
            img_json.put("file_name", i.getName());
            img_json.put("height", height);
            img_json.put("width", width);
            img_json.put("id", i.getId());

            images_list.add(img_json);
        }
        final_json.put("images", images_list);

        //categories
        List<Map<String, Object>> categories_list = new ArrayList<>();
        Map<String, Integer> category = new HashMap<>();
        int id_count = 1;
        for(Image i: mark_image_list){
            List<Tag> tag_list = tagService.FindByImageid(i.getId());
            for(Tag t: tag_list){
                if(category.get(t.getName())==null)
                    category.put(t.getName(), id_count++);
            }
        }
        for(Map.Entry<String, Integer> entry: category.entrySet()){
            Map<String, Object> category_json = new HashMap<>();
            category_json.put("supercategory", "Tag");
            category_json.put("id", entry.getValue());
            category_json.put("name", entry.getKey());
            categories_list.add(category_json);
        }
        final_json.put("categories", categories_list);

        //annotations
        List<Map<String, Object>> annotations_list = new ArrayList<>();
        for(Image i: mark_image_list){
            int width = 0;
            int height = 0;
            File oldimage = new File(image_path + "/" + i.getName());
            InputStream inStream = new FileInputStream(oldimage); //读入原文件
            BufferedImage src = javax.imageio.ImageIO.read(inStream);
            width = src.getWidth();
            height = src.getHeight();

            List<Tag> tag_list = tagService.FindByImageid(i.getId());
            for(Tag t: tag_list){
                double xmin = Double.parseDouble(t.getX().substring(0,t.getX().length()-1));
                xmin = xmin/100*width;
                double ymin = Double.parseDouble(t.getY().substring(0,t.getY().length()-1));
                ymin = ymin/100*height;
                double xmax = Double.parseDouble(t.getXm().substring(0,t.getXm().length()-1));
                xmax = xmax/100*width;
                double ymax = Double.parseDouble(t.getYm().substring(0,t.getYm().length()-1));
                ymax = ymax/100*height;

                Map<String, Object> annotation_json = new HashMap<>();
                List<List> segmentation_list = new ArrayList<>();
                List<Integer> segmentation_list_list = new ArrayList<>();
                segmentation_list_list.add((int)xmin);
                segmentation_list_list.add((int)ymin);
                segmentation_list_list.add((int)xmax);
                segmentation_list_list.add((int)ymin);
                segmentation_list_list.add((int)xmax);
                segmentation_list_list.add((int)ymax);
                segmentation_list_list.add((int)xmin);
                segmentation_list_list.add((int)ymax);
                segmentation_list.add(segmentation_list_list);
                annotation_json.put("segmentation", segmentation_list);

                annotation_json.put("area", (int)((xmax-xmin)*(ymax-ymin)));
                annotation_json.put("iscrowd", 0);
                annotation_json.put("image_id", i.getId());

                List<Integer> bbox_list = new ArrayList<>();
                bbox_list.add((int)xmin);
                bbox_list.add((int)ymin);
                bbox_list.add(width);
                bbox_list.add(height);
                annotation_json.put("bbox", bbox_list);

                annotation_json.put("category_id", category.get(t.getName()));
                annotation_json.put("id", t.getId());

                annotations_list.add(annotation_json);
            }
        }
        final_json.put("annotations", annotations_list);

        JSONObject jsonObject = JSONObject.fromObject(final_json);
        String jsonString = jsonObject.toString();
        CreateFileUtil.createJsonFile(jsonString, annotations_path, "instances_train");

        Map<String, String> path_map = new HashMap<>();
        path_map.put("download_path", download_path);
        return path_map;
    }

    @RequestMapping("base64_image")
    public void NewScreenshot(@RequestBody Map<String, String> map){
        String base64_img = map.get("imgByte");
        if(base64_img_list==null)
            base64_img_list = new ArrayList<>();
        base64_img_list.add(base64_img);
    }

    private static String getFileNameNew() {
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        return fmt.format(new Date());
    }

    @RequestMapping("create_video_task")
    public void CreateVideoTask(@RequestBody Map<String, String> map){
        if (login_user == -1)
            return;

        String name = map.get("name");
        String requirement = map.get("requirement");

        Task t = taskService.SaveTask(login_user, name, requirement);

        for (String imgByte : base64_img_list){
            if (imgByte.contains("data:")) {
                int start = imgByte.indexOf(",");
                imgByte = imgByte.substring(start + 1);
            }
            imgByte = imgByte.replaceAll("\r|\n", "");
            imgByte = imgByte.trim();

            String path = image_path;
            try {
                byte[] bytes1 = Base64.getDecoder().decode(imgByte);
                ByteArrayInputStream bais = new ByteArrayInputStream(bytes1);
                BufferedImage bi1 = ImageIO.read(bais);
                String image_name = getFileNameNew()+".jpeg";
                File f1 = new File(path+"/"+image_name);
                ImageIO.write(bi1, "jpg", f1);
                imageService.SaveImage(image_name, t.getId());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        base64_img_list = null;
    }
}

class CreateFileUtil {
    /**
     * 生成.json格式文件
     */
    public static boolean createJsonFile(String jsonString, String filePath, String fileName) {
        // 标记文件生成是否成功
        boolean flag = true;

        // 拼接文件完整路径
        String fullPath = filePath + File.separator + fileName + ".json";

        // 生成json格式文件
        try {
            // 保证创建一个新文件
            File file = new File(fullPath);
            if (!file.getParentFile().exists()) { // 如果父目录不存在，创建父目录
                file.getParentFile().mkdirs();
            }
            if (file.exists()) { // 如果已存在,删除旧文件
                file.delete();
            }
            file.createNewFile();

            if(jsonString.indexOf("'")!=-1){
                //将单引号转义一下，因为JSON串中的字符串类型可以单引号引起来的
                jsonString = jsonString.replaceAll("'", "\\'");
            }
            if(jsonString.indexOf("\"")!=-1){
                //将双引号转义一下，因为JSON串中的字符串类型可以单引号引起来的
                jsonString = jsonString.replaceAll("\"", "\\\"");
            }

            if(jsonString.indexOf("\r\n")!=-1){
                //将回车换行转换一下，因为JSON串中字符串不能出现显式的回车换行
                jsonString = jsonString.replaceAll("\r\n", "\\u000d\\u000a");
            }
            if(jsonString.indexOf("\n")!=-1){
                //将换行转换一下，因为JSON串中字符串不能出现显式的换行
                jsonString = jsonString.replaceAll("\n", "\\u000a");
            }

            // 格式化json字符串
            jsonString = JsonFormatTool.formatJson(jsonString);

            // 将格式化后的字符串写入文件
            Writer write = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
            write.write(jsonString);
            write.flush();
            write.close();
        } catch (Exception e) {
            flag = false;
            e.printStackTrace();
        }

        // 返回是否成功的标记
        return flag;
    }

}

class JsonFormatTool {
    /**
     * 单位缩进字符串。
     */
    private static String SPACE = "   ";

    /**
     * 返回格式化JSON字符串。
     *
     * @param json 未格式化的JSON字符串。
     * @return 格式化的JSON字符串。
     */
    public static String formatJson(String json) {
        StringBuffer result = new StringBuffer();

        int length = json.length();
        int number = 0;
        char key = 0;

        // 遍历输入字符串。
        for (int i = 0; i < length; i++) {
            // 1、获取当前字符。
            key = json.charAt(i);

            // 2、如果当前字符是前方括号、前花括号做如下处理：
            if ((key == '[') || (key == '{')) {
                // （1）如果前面还有字符，并且字符为“：”，打印：换行和缩进字符字符串。
                if ((i - 1 > 0) && (json.charAt(i - 1) == ':')) {
                    result.append('\n');
                    result.append(indent(number));
                }

                // （2）打印：当前字符。
                result.append(key);

                // （3）前方括号、前花括号，的后面必须换行。打印：换行。
                result.append('\n');

                // （4）每出现一次前方括号、前花括号；缩进次数增加一次。打印：新行缩进。
                number++;
                result.append(indent(number));

                // （5）进行下一次循环。
                continue;
            }

            // 3、如果当前字符是后方括号、后花括号做如下处理：
            if ((key == ']') || (key == '}')) {
                // （1）后方括号、后花括号，的前面必须换行。打印：换行。
                result.append('\n');

                // （2）每出现一次后方括号、后花括号；缩进次数减少一次。打印：缩进。
                number--;
                result.append(indent(number));

                // （3）打印：当前字符。
                result.append(key);

                // （4）如果当前字符后面还有字符，并且字符不为“，”，打印：换行。
                if (((i + 1) < length) && (json.charAt(i + 1) != ',')) {
                    result.append('\n');
                }

                // （5）继续下一次循环。
                continue;
            }

            // 4、如果当前字符是逗号。逗号后面换行，并缩进，不改变缩进次数。
            if ((key == ',')) {
                result.append(key);
                result.append('\n');
                result.append(indent(number));
                continue;
            }

            // 5、打印：当前字符。
            result.append(key);
        }

        return result.toString();
    }

    /**
     * 返回指定次数的缩进字符串。每一次缩进三个空格，即SPACE。
     *
     * @param number 缩进次数。
     * @return 指定缩进次数的字符串。
     */
    private static String indent(int number) {
        StringBuffer result = new StringBuffer();
        for (int i = 0; i < number; i++) {
            result.append(SPACE);
        }
        return result.toString();
    }
}