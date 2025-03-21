import { define } from "~/utils/server/core.ts";
import {
	ClassroomTestQuiz,
	randomizeClassroomTestQuestions,
	retrieveClassroomTestResponse,
} from "~/utils/server/classrooms.ts";
import { page, RouteConfig } from "fresh";
import { ClassroomTestForm } from "~/islands/ClassroomTestForm.tsx";

export const config: RouteConfig = {
	skipInheritedLayouts: true,
};

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const test = ctx.state.classroomTest!;

		const response = await retrieveClassroomTestResponse(
			classroom.id,
			test.id,
			classroom.currentMember.userId,
		);

		if (!response) {
			const randomizedOrder = await randomizeClassroomTestQuestions(
				classroom.id,
				test.id,
				classroom.currentMember.userId,
			);
			const questions = randomizedOrder.map((question) => {
				const currentQuestion = test.quiz.at(question.questionId)!;
				const choices = question.choices.map((choice) =>
					currentQuestion.choices.at(choice.choiceId)!
				);

				return {
					question: currentQuestion.question,
					choices,
				} satisfies ClassroomTestQuiz;
			});
			return page(questions);
		} else {
			return ctx.redirect(ctx.url.pathname + "/info");
		}
	},
});

export default define.page<typeof handler>(({ data, state }) => {
	return (
		<ClassroomTestForm
			classroommId={state.classroom!.id}
			testId={state.classroomTest!.id}
			questions={data}
		/>
	);
});
