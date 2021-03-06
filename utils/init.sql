create table if not exists staff (
  staff_id int primary key not null, /* */
  staff_name varchar(5) not null,       /* 姓名 */
  staff_notes_id varchar(20) not null,  /* notesId */
  staff_password varchar(20) not null,
  staff_email varchar(50) not null,
  group_id int not null,          /* 组别，前端or能开*/
  base_id int not null,           /* base地*/
  branch_id int not null,         /* 所属分支 */
  level_id int not null,          /* 级别 */ 
  type_id int not null            /* 岗位类别，规划、设计、实现、测试、产品、运营*/
);

create table if not exists staff_role (
  role_id int primary key not null,
  role_code varchar(50) not null,
  role_name varchar(50) not null
);

create table if not exists staff_role_rel (
  rel_id int primary key not null,
  role_id int not null,
  staff_id int not null
);

create table if not exists staff_type (
  type_id int primary key not null,
  type_name varchar(20) not null
);

create table if not exists staff_group (
  group_id int primary key not null,
  group_name varchar(20) not null
);

create table if not exists staff_base (
  base_id int primary key not null,
  base_name varchar(50) not null
);

create table if not exists staff_branch (
  branch_id int primary key not null,
  branch_name varchar(50) not null
);

create table if not exists staff_level (
  level_id int primary key not null,
  level_name varchar(10) not null
);

create table if not exists project_state (
  state_id int primary key not null,
  state_name varchar(10) not null
);

create table if not exists weekly_report_projects (
  weekly_project_id int primary key not null AUTO_INCREMENT COMMENT '主键',
  staff_id int not null,
  project_type varchar(10) not null,
  branch_id int not null,
  project_name varchar(100) not null,
  project_state_id int not null,
  next_work varchar(1000) not null,
  week_range varchar(20) not null
);

create table if not exists weekly_report_summarize (
  weekly_summarize_id int primary key not null AUTO_INCREMENT COMMENT '主键',
  staff_id int not null,
  staff_name varchar(5) not null,       /* 姓名 */
  staff_notes_id varchar(20) not null,  /* notesId */
  project_name varchar(100) not null,
  work_type varchar(10) not null,
  week_range varchar(20) not null,
  weekly_work varchar(1000) not null,
  next_weekly_work varchar(1000) not null
);

create table if not exists weekly_report_output (
  weekly_output_id int primary key not null AUTO_INCREMENT COMMENT '主键',
  staff_id int not null,
  staff_name varchar(5) not null,       /* 姓名 */
  staff_notes_id varchar(20) not null,  /* notesId */
  article_name varchar(200) not null,
  article_url varchar(200) not null,
  week_range varchar(20) not null
);

create table if not exists weekly_report_interest (
  weekly_interest_id int primary key not null AUTO_INCREMENT COMMENT '主键',
  staff_id int not null,
  staff_name varchar(5) not null,       /* 姓名 */
  staff_notes_id varchar(20) not null,  /* notesId */
  week_range varchar(20) not null,
  interest_module varchar(200) not null,
  interest_technic varchar(200) not null,
  interest_cost int not null,       /*成本，投入人天*/
  interest_mouth int not null      /*参与月份*/
);

create table if not exists weekly_report_assist (
  weekly_assist_id int primary key not null AUTO_INCREMENT COMMENT '主键',
  staff_id int not null,
  staff_name varchar(5) not null,       /* 姓名 */
  staff_notes_id varchar(20) not null,  /* notesId */
  week_range varchar(20) not null,
  group_id int not null,
  branch_id int not null,
  assist_resolve varchar(100) not null,
  assist_url varchar(100) not null
);

create table if not exists project_info (
  project_id int primary key not null AUTO_INCREMENT COMMENT '主键',
  project_name varchar(100) not null COMMENT '项目名称',
  state_id int not null COMMENT '项目类别',
  branch_id int not null COMMENT '所属分支',
  staff_id int not null COMMENT 'NOTESID'
)

/* init data */
insert into staff_branch(branch_id, branch_name) values(1, '移动总部');
insert into staff_branch(branch_id, branch_name) values(2, '北京电信');
insert into staff_branch(branch_id, branch_name) values(3, '北京联通');
insert into staff_branch(branch_id, branch_name) values(4, '天津电信');
insert into staff_branch(branch_id, branch_name) values(5, '山西移动');
insert into staff_branch(branch_id, branch_name) values(6, '山西电信');
insert into staff_branch(branch_id, branch_name) values(7, '陕西移动');
insert into staff_branch(branch_id, branch_name) values(8, '吉林电信');
insert into staff_branch(branch_id, branch_name) values(9, '吉林移动');
insert into staff_branch(branch_id, branch_name) values(10, '黑龙江移动');
insert into staff_branch(branch_id, branch_name) values(11, '安徽移动');
insert into staff_branch(branch_id, branch_name) values(12, '安徽联通');
insert into staff_branch(branch_id, branch_name) values(13, '浙江电信');
insert into staff_branch(branch_id, branch_name) values(14, '广东联通');
insert into staff_branch(branch_id, branch_name) values(15, '山东联通');
insert into staff_branch(branch_id, branch_name) values(16, '新疆联通');
insert into staff_branch(branch_id, branch_name) values(17, '联通国际');
insert into staff_branch(branch_id, branch_name) values(18, '四川广电');
insert into staff_branch(branch_id, branch_name) values(19, '四川移动');
insert into staff_branch(branch_id, branch_name) values(20, '智慧旅游');
insert into staff_branch(branch_id, branch_name) values(21, '未来之星');


insert into staff_base(base_id, base_name) values(1, '北京');
insert into staff_base(base_id, base_name) values(2, '山西');
insert into staff_base(base_id, base_name) values(3, '陕西');
insert into staff_base(base_id, base_name) values(4, '黑龙江');
insert into staff_base(base_id, base_name) values(5, '吉林');
insert into staff_base(base_id, base_name) values(6, '天津');
insert into staff_base(base_id, base_name) values(7, '浙江');
insert into staff_base(base_id, base_name) values(8, '安徽');


insert into staff_type(type_id, type_name) values(1, '规划');
insert into staff_type(type_id, type_name) values(2, '设计');
insert into staff_type(type_id, type_name) values(3, '产品');
insert into staff_type(type_id, type_name) values(4, '实现');
insert into staff_type(type_id, type_name) values(5, '测试');
insert into staff_type(type_id, type_name) values(6, '运营');


insert into staff_group(group_id, group_name) values(1, '前端');
insert into staff_group(group_id, group_name) values(2, '能开');


insert into staff_level(level_id, level_name) values(2, '实习生');
insert into staff_level(level_id, level_name) values(3, '助理工程师');
insert into staff_level(level_id, level_name) values(4, '工程师');
insert into staff_level(level_id, level_name) values(5, '高级工程师');
insert into staff_level(level_id, level_name) values(6, '主任工程师');
insert into staff_level(level_id, level_name) values(7, '高级主任工程师');
insert into staff_level(level_id, level_name) values(8, '技术专家');


insert into project_state(state_id, state_name) values(1, '商务');
insert into project_state(state_id, state_name) values(2, '研发');
insert into project_state(state_id, state_name) values(3, '培训');

insert into staff_role(role_id, role_code, role_name) values(1, 'super_admin', '超级管理员');
insert into staff_role(role_id, role_code, role_name) values(2, 'weekly_leader', '周报管理');
insert into staff_role(role_id, role_code, role_name) values(3, 'weekly_staff', '周报录入');

insert into staff_role_rel(rel_id, role_id, staff_id) values(1, 1, 1);
insert into staff_role_rel(rel_id, role_id, staff_id) values(2, 2, 1);
insert into staff_role_rel(rel_id, role_id, staff_id) values(3, 3, 1);
insert into staff_role_rel(rel_id, role_id, staff_id) values(4, 3, 2);
insert into staff_role_rel(rel_id, role_id, staff_id) values(5, 3, 3);
insert into staff_role_rel(rel_id, role_id, staff_id) values(6, 3, 4);
insert into staff_role_rel(rel_id, role_id, staff_id) values(7, 3, 5);
insert into staff_role_rel(rel_id, role_id, staff_id) values(8, 2, 6);
insert into staff_role_rel(rel_id, role_id, staff_id) values(9, 3, 6);

insert into project_info(project_name, state_id, branch_id, staff_id) values('多语言/互联网安全', 2, 5, 1);
insert into project_info(project_name, state_id, branch_id, staff_id) values('山西移动全业务支撑平台', 1, 5, 1);
insert into project_info(project_name, state_id, branch_id, staff_id) values('智慧营业厅', 1, 5, 2);
insert into project_info(project_name, state_id, branch_id, staff_id) values('北京电信数据分析', 1, 2, 5);
insert into project_info(project_name, state_id, branch_id, staff_id) values('北京联通触点运营平台', 1, 3, 3);
insert into project_info(project_name, state_id, branch_id, staff_id) values('云码通-智慧旅游', 2, 20, 4);