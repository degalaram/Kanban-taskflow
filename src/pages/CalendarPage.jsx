
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar, Zap } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { sections, tasks } = useSelector((state) => state.kanban);

  const allTasks = useMemo(() => {
    const tasksList = [];
    sections.forEach((section) => {
      const sectionTasks = tasks[section.id] || [];
      sectionTasks.forEach((task) => {
        tasksList.push({
          ...task,
          sectionTitle: section.title,
          sectionId: section.id,
        });
      });
    });
    return tasksList;
  }, [sections, tasks]);

  const tasksByDate = useMemo(() => {
    const grouped = {};
    allTasks.forEach((task) => {
      const date = new Date(task.createdAt).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(task);
    });
    return grouped;
  }, [allTasks]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getTasksForDay = (day) => {
    const date = new Date(currentYear, currentMonth, day).toDateString();
    return tasksByDate[date] || [];
  };

  const selectedDayTasks = getTasksForDay(today.getDate());

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">View your tasks by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-xl font-semibold text-foreground w-40">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayTasks = day ? getTasksForDay(day) : [];
              const dayDate = day ? new Date(currentYear, currentMonth, day) : null;

              return (
                <div
                  key={index}
                  className={`
                    aspect-square p-1 rounded-lg flex flex-col items-center justify-start text-sm
                    ${day ? 'cursor-pointer hover:bg-muted transition-colors border border-transparent' : ''}
                    ${isToday(day) ? 'bg-primary text-primary-foreground font-bold border-primary' : 'text-foreground'}
                  `}
                >
                  {day && (
                    <>
                      <span className="font-semibold text-xs md:text-sm">{day}</span>
                      {dayTasks.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                          {dayTasks.slice(0, 2).map((task, idx) => (
                            <div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-inprogress"
                              title={task.title}
                            />
                          ))}
                          {dayTasks.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{dayTasks.length - 2}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-inprogress" />
              <span className="text-muted-foreground">Task scheduled</span>
            </div>
          </div>
        </div>

        {/* Today's Tasks Sidebar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Today</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {selectedDayTasks.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No tasks for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <h4 className="text-sm font-medium text-foreground line-clamp-2">
                    {task.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.sectionTitle}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Total tasks: {allTasks.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
