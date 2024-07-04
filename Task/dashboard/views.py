from django.shortcuts import render, HttpResponse
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from ..models import Task  # Import your Task model
from django.utils.timezone import now
from django.core.exceptions import ValidationError

@login_required
def dash(request):
    return render(request, 'dashboard/dash.html')

@login_required
def taskDatas(request):
    if request.method == 'POST':
        priority = request.POST.get('filter-priority')
        due_date = request.POST.get('filter-due-date')
        category = request.POST.get('filter-category')
        
        tasks = Task.objects.filter(
            assigned_to=request.user,
            status__in=['In Progress', 'Completed', 'Overdue']
        )
        
        if priority:
            tasks = tasks.filter(priority=priority)
        if due_date:
            tasks = tasks.filter(due_date__lte=due_date)  # Assuming due_date is in format suitable for comparison
        if category:
            tasks = tasks.filter(category__icontains=category)
        
        # Separate querysets for each status
        inprogress = tasks.filter(status='In Progress').order_by('-created_at').values()
        completed = tasks.filter(status='Completed').order_by('-created_at').values()
        overdue = tasks.filter(status='Overdue').order_by('-created_at').values()
        
        # Count tasks for each status
        inprogress_count = inprogress.count()
        completed_count = completed.count()
        overdue_count = overdue.count()
        
        context = {
            'inprogress': list(inprogress),
            'completed': list(completed),
            'overdue': list(overdue),
            'inprogress_count': inprogress_count,
            'completed_count': completed_count,
            'overdue_count': overdue_count,
            'selected_priority': priority,
            'selected_due_date': due_date,
            'selected_category': category,
        }
    else:
        # Fetch tasks for each status by default
        inprogress = Task.objects.filter(assigned_to=request.user, status='In Progress').order_by('-created_at').values()
        completed = Task.objects.filter(assigned_to=request.user, status='Completed').order_by('-created_at').values()
        overdue = Task.objects.filter(assigned_to=request.user, status='Overdue').order_by('-created_at').values()
        
        # Count tasks for each status
        inprogress_count = inprogress.count()
        completed_count = completed.count()
        overdue_count = overdue.count()
        
        context = {
            'inprogress': list(inprogress),
            'completed': list(completed),
            'overdue': list(overdue),
            'inprogress_count': inprogress_count,
            'completed_count': completed_count,
            'overdue_count': overdue_count,
        }
        
    return JsonResponse({"data": context})

@require_POST
@login_required
def insert_task(request):
    title = request.POST.get('title')
    description = request.POST.get('description')
    status = request.POST.get('status')
    priority = request.POST.get('priority')
    due_date = request.POST.get('due_date')
    category = request.POST.get('category')
    assigned_to = request.user  # Task assigned to current user
    
    # Server-side validation
    if not title or not description or not status or not priority or not due_date or not category:
        return JsonResponse({"error": "All fields are required."}, status=400)
    
    try:
        task = Task.objects.create(
            title=title,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date,
            category=category,
            assigned_to=assigned_to,
        )
        task.full_clean()
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"message": 'Task created successfully'})

@require_POST
@login_required
def move_task(request):
    draggable_div_id = request.POST.get('draggableDivID') 
    drop_div_status = request.POST.get('dropDivStatus')

    try:
        task = Task.objects.get(id=draggable_div_id)
        task.status = drop_div_status
        task.created_at = now()  # Use django.utils.timezone.now() for timezone-aware datetime
        task.save()

        # Manually serialize the task object
        task_data = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status.lower().replace(" ", ""),
            'priority': task.priority,
            'due_date': task.due_date,
            'category': task.category,
            'assigned_to': task.assigned_to.username,
            'created_at': task.created_at
        }

        return JsonResponse({'message': 'Task moved successfully', 'data': task_data})
    
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_POST
@login_required
def edit_task(request):
    id = request.POST.get('id')
    title = request.POST.get('title')
    description = request.POST.get('description')
    status = request.POST.get('status')
    priority = request.POST.get('priority')
    due_date = request.POST.get('due_date')
    category = request.POST.get('category')
    assigned_to = request.user  # Task assigned to current user

    if not id or not title or not description or not status or not priority or not due_date or not category:
        return JsonResponse({"error": "All fields are required."}, status=400)

    try:
        Task.objects.filter(id=id).update(
            title=title,
            description=description,
            status=status,
            priority=priority,
            due_date=due_date,
            category=category,
            assigned_to=assigned_to,
        )
    except ValidationError as e:
        return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"message": 'Task updated successfully'})

@require_POST
@login_required
def delete_task(request):
    id = request.POST.get('id')

    if not id:
        return JsonResponse({"error": "Task ID is required."}, status=400)

    Task.objects.filter(id=id).delete()
    
    return JsonResponse({"message": 'Task deleted successfully'})
