import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/board";
import { ProjectCard, ProjectCardMemo } from "@/components/tasks/kanban/card";
import { KanbanColumn } from "@/components/tasks/kanban/column";
import { KanbanItem } from "@/components/tasks/kanban/item";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { useList } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React from "react";

export const List = () => {
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    pagination: {
      mode: "off",
    },
    queryOptions: {
      enabled: !!stages,
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unasignedStage: [],
        stages: [],
      };
    }
    const unasignedStage = tasks.data.filter((task) => task.stageId === null);
    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));
  }, [stages, tasks]);

  const handleAddCard = (args: { stageId: string }) => {};

  console.log(tasks);

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumn
            id="unasigned"
            title={"unasigned"}
            count={taskStages?.unasignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unasigned" })}
          >
            {taskStages?.unasignedStage.map((task) => (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ ...task, stageId: "unasigned" }}
              >
                <ProjectCardMemo
                  {...task}
                  dueDate={task.dueDate || undefined}
                />
              </KanbanItem>
            ))}
            {!taskStages?.unasignedStage.length && (
              <KanbanAddCardButton onClick={() => handleAddCard({stageId: 'unasigned'})} />
            ) }
          </KanbanColumn>
        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  );
};
