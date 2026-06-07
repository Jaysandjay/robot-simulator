import math
import random

TASKS = ["patrolling", "delivery", "waiting"]


class Robot:
    def __init__(self, robot_id: str):
        self.id = robot_id
        self.x = random.uniform(5, 95)
        self.y = random.uniform(5, 95)
        self.heading = random.uniform(0, 360)
        self.speed = random.uniform(0.8, 2.2)
        self.status = "moving"
        self.battery = random.uniform(40, 100)
        self.task = random.choice(TASKS)


class RobotSimulator:
    def __init__(self, num_robots: int = 5):
        self.robots = [Robot(f"robot_{i + 1}") for i in range(num_robots)]

    def tick(self):
        for robot in self.robots:
            if robot.status == "charging":
                robot.battery = min(100.0, robot.battery + 0.5)
                if robot.battery >= 90:
                    robot.status = "moving"
                    robot.task = random.choice(TASKS)
                continue

            rad = math.radians(robot.heading)
            new_x = robot.x + math.cos(rad) * robot.speed
            new_y = robot.y + math.sin(rad) * robot.speed

            if not (0 <= new_x <= 100):
                robot.heading = (180 - robot.heading) % 360
                new_x = max(0.0, min(100.0, new_x))
            if not (0 <= new_y <= 100):
                robot.heading = (-robot.heading) % 360
                new_y = max(0.0, min(100.0, new_y))

            robot.x = new_x
            robot.y = new_y
            robot.heading = (robot.heading + random.uniform(-6, 6)) % 360
            robot.battery = max(0.0, robot.battery - 0.2)

            if robot.battery < 15:
                robot.status = "charging"
                robot.task = "charging"
            elif robot.status != "error":
                if random.random() < 0.004:
                    robot.status = "error"
                else:
                    robot.status = "moving"
            else:
                if random.random() < 0.08:
                    robot.status = "moving"

    def snapshot(self) -> list[dict]:
        return [
            {
                "id": r.id,
                "position": {"x": round(r.x, 2), "y": round(r.y, 2)},
                "heading": round(r.heading, 1),
                "speed": round(r.speed, 2),
                "status": r.status,
                "battery": round(r.battery, 1),
                "task": r.task,
            }
            for r in self.robots
        ]
