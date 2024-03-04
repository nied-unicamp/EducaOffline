export interface CalEvent {
  description: string;
  eventId?: number;
  link: string;
  startDate: Date;
  endDate?: Date;
}

export interface CalEventJson {
  description: string;
  eventId?: number;
  link: string;
  startDate: string;
  endDate?: string;
}


/**
 * Defines an event of the calendar
 *
 */
export class CalendarEvent {

  /**
   * Date of the event. If the event has an endDate, it's when the event start
   */
  private startDate: Date;


  /**
   * Date when the event is over. Optional
   */
  private endDate?: Date;


  /**
   * Brief description of the event
   */
  private description?: string;


  /**
   * Course related to that event
   */
  private courseId?: number;


  /**
   * Tool related to that event
   */
  private toolId?: number;


  /**
   * Item related to that event
   */
  private itemId?: number;

  constructor(startDate: Date, endDate?: Date | string, description?: string,
    courseId?: number, toolId?: number, itemId?: number) {

    this.setStartDate(startDate);

    if (!!endDate) {
      if (endDate instanceof Date) {
        this.setEndDate(endDate);
      } else {
        this.setEndDate(new Date(endDate));
      }
    }

    this.setDescription(description);
    this.setCourseId(courseId);
    this.setToolId(toolId);
    this.setItemId(itemId);
  }


  /*********************** Getters and setters ***********************/

  setStartDate(date: Date) {
    this.startDate = new Date(date);
  }

  getStartDate(): Date {
    return this.startDate;
  }

  setEndDate(date: Date) {
    this.endDate = new Date(date);
  }

  getEndDate(): Date {
    return this.endDate;
  }

  setDescription(text: string) {
    this.description = text;
  }

  getDescription(): string {
    return this.description;
  }

  setCourseId(id: number) {
    this.courseId = id;
  }

  getCourseId(): number {
    return this.courseId;
  }

  setToolId(id: number) {
    this.toolId = id;
  }

  getToolId(): number {
    return this.toolId;
  }

  setItemId(id: number) {
    this.itemId = id;
  }

  getItemId(): number {
    return this.itemId;
  }


  /*********************** Event state analysis **********************/

  hasEndDate(): boolean {
    return (this.endDate !== null);
  }

  hasEnded(date: Date): boolean {
    return ((!this.hasEndDate() && this.hasStarted(date)) ||
      (this.removeHour(date) > this.removeHour(this.getEndDate())));
  }

  hasStarted(date: Date): boolean {
    return this.removeHour(date) > this.removeHour(this.getStartDate());
  }

  isHappening(date: Date): boolean {
    return this.hasStarted(date) && !this.hasEnded(date);
  }

  startsToday(date: Date): boolean {
    return this.isToday(date, this.getStartDate());
  }

  endsToday(date: Date): boolean {
    return this.isToday(date, this.getEndDate());
  }

  private isToday(d0: Date, d1: Date): boolean {
    if (!d0 || !d1) {
      return false;
    }

    return d0.getFullYear() === d1.getFullYear() && d0.getMonth() === d1.getMonth() &&
      d0.getDate() === d1.getDate();
  }

  private removeHour(date: Date): Date {
    const newDate: Date = new Date(date);

    newDate.setHours(0, 0, 0);

    return newDate;
  }

  generateLink(): string {
    return '/courses/' + this.courseId + '/' + this.getToolName(this.toolId) + '/' + this.itemId;
  }

  getToolName(id: number): string {
    if (id === 1) {
      return 'activities';
    }

    return 'error';
  }
}




/**
 * Class that declare and manage a calendar state
 *
 */
export class CalendarSnapshot {

  /**
   * Date used as a reference to display the calendar
   */
  private displayedDate: Date;


  /**
   * Calendar mode
   */
  private mode: 'month' | 'week';


  constructor(date: Date, mode: 'month' | 'week' = 'month') {
    this.setDisplayedDate(date);
    this.setMode(mode);
  }


  /********************** Getters and Setters ******************/

  setDisplayedDate(date: Date): void {
    this.displayedDate = new Date(date);
  }

  getDisplayedDate(): Date {
    return this.displayedDate;
  }

  setMode(mode: 'week' | 'month') {
    this.mode = mode;
  }

  getMode(): 'week' | 'month' {
    return this.mode;
  }


  getMonth(): number {
    return this.getDisplayedDate().getMonth();
  }

  getYear(): number {
    return this.getDisplayedDate().getFullYear();
  }

  /************************* View management *******************/


  /**
   * Change the calendar to the next week/month
   *
   */
  nextView() {
    this.changeView(1);
  }


  /**
   * Change the calendar to the previous week/month
   *
   */
  previousView() {
    this.changeView(-1);
  }


  /**
   * Change the week/month view by an given offset
   *
   * @param offset - How many views will change (can be negative)
   */
  changeView(offset: number) {
    if (this.getMode() === 'week') {
      this.changeWeek(offset);
    } else if (this.getMode() === 'month') {
      this.changeMonth(offset);
    }
  }


  /**
   * Change shown month by an offset
   *
   * @param offset - How many months will change (can be negative)
   */
  changeMonth(offset: number) {
    const date = new Date(this.getDisplayedDate());

    if (date.getDate() > 28) {
      date.setDate(28);
    }

    date.setMonth(date.getMonth() + offset);

    this.setDisplayedDate(date);
  }


  /**
   * Change shown week by an offset
   *
   * @param offset - How many weeks will change (can be negative)
   */
  changeWeek(offset: number) {
    const date = new Date(this.getDisplayedDate());

    date.setDate(date.getDate() + 7 * offset);

    this.setDisplayedDate(date);
  }


  /*********************** Other utilities ********************/

  isSameMonth(date: Date): boolean {
    return date.getFullYear() === this.getDisplayedDate().getFullYear() &&
      date.getMonth() === this.getDisplayedDate().getMonth();
  }

  isDisplayedDate(date: Date): boolean {
    return this.isSameMonth(date) && date.getDate() === this.getDisplayedDate().getDate();
  }

  /**
   * Generate an array of dates that will be displayed.
   * It uses the displayed date and the calendar mode.
   *
   * @returns - Array of dates to be displayed in the calendar
   */
  generateDateTable(): Date[] {
    // Table with the output
    const table: Date[] = [] as Date[];

    // First date to appear in the calendar
    const startDate: Date = new Date(this.getDisplayedDate());

    // How many days to show
    let size = 0;

    if (this.getMode() === 'week') {
      // Show 7 days
      size = 7;

      // Set the first date to appear on the calendar
      startDate.setDate(startDate.getDate() - startDate.getDay());
    } else if (this.getMode() === 'month') {
      // Show 6 weeks
      size = 6 * 7;

      // Set the first date to appear on the calendar
      startDate.setDate(1);
      startDate.setDate(startDate.getDate() - startDate.getDay());
    }

    // Insert all days to be displayed in the table
    for (; size > 0; --size) {
      table.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return table;
  }
}
