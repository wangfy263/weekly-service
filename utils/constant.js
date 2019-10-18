const constants = {};
constants.defaultPassword = '123456'
constants.property = ['staff_group', 'staff_base', 'staff_branch', 'staff_level', 'staff_type', 'project_state'];

constants.queryUserALLSql = 'select * from staff';
constants.queryUserSql = 'select * from staff where staff_notes_id = ?';
constants.queryGroupSql = 'select * from staff_group';
constants.queryBaseSql = 'select * from staff_base';
constants.queryBranchSql = 'select * from staff_branch';
constants.queryLevelSql = 'select * from staff_level';
constants.queryTypeSql = 'select * from staff_type';
constants.queryStateSql = 'select * from project_state';

constants.export_condition = " where week_range =";
constants.queryProjectsSql = "select * from weekly_report_projects";
constants.querySummarizeSql = "select * from weekly_report_summarize";
constants.queryOutputSql = "select * from weekly_report_output";
constants.queryInterestSql = "select * from weekly_report_interest";
constants.queryAssistSql = "select * from weekly_report_assist";

constants.nosend_condition = "where staff_id not in ";
constants.queryEmailsSql = "select staff_email from staff ";

constants.staff_condition = " where group_id = ";
// constants.queryStaffSql = "select * from staff";

constants.queryUserAccessSql = 'select role_code from staff_role a join staff_role_rel b where a.role_id = b.role_id and b.staff_id = '

constants.queryProjects = 'select * from project_info'
constants.queryProjectsById = 'select * from project_info where staff_id = ?'
constants.saveProjectSql = 'insert into project_info set ?'
constants.updProjectSql = 'update project_info set project_name = ?, state_id = ?, branch_id = ?, staff_id = ? where project_id=?'
constants.delProjectSql = 'delete from project_info where project_id = ?'

constants.saveStaffSql = 'insert into staff set ?'
constants.updStaffSql = 'update staff set staff_name = ?, staff_notes_id = ?, staff_email = ?, group_id = ?, base_id = ?, branch_id = ?, level_id = ?, type_id = ?  where staff_id = ?'
constants.delStaffSql = 'delete from staff where staff_id = ?'

constants.saveRoleRelSql = 'insert into staff_role_rel set ?'
constants.qryUserRolesql = 'select * from staff_role_rel'
constants.delUserRoleSql = 'delete from staff_role_rel where staff_id = ?'
// constants.saveRoleSql = 'update staff_role set '
module.exports = constants;