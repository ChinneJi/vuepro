import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);

//年级相关状态
import GradeStore from './modules/base/gradeStore'
//学校相关状态
import SchoolStore from './modules/base/schoolStore'
//班级相关状态
import ClazzStore from './modules/base/clazzStore'
//课程相关状态
import CourseStore from './modules/base/courseStore'
//教师相关状态
import TeacherStore from './modules/base/teacherStore'
//问卷相关状态
import 	QuestionStore from './modules/questionnaire/questionStore'

export default new Vuex.Store({
	modules:{
		GradeStore,
		SchoolStore,
		ClazzStore,
		CourseStore,
		TeacherStore,
		QuestionStore

	}
});