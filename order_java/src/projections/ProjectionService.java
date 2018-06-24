package projections;

import events.schema.Event;
import projections.orderStatus.OrderStatusService;

public class ProjectionService {
    static ProjectionService instance;

    public static ProjectionService getInstance() {
        if(instance == null) {
            instance = new ProjectionService();
        }
        return instance;
    }

    public void updateProjections(Event event) {
        new Thread(() -> OrderStatusService.getInstance().update(event)).start();
    }
}