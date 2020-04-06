import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExercise, deleteExercise, getExercises, patchExercise } from '../api/exercises-api'
import Auth from '../auth/Auth'
import { Exercise } from '../types/Exercise'

interface ExercisesProps {
  auth: Auth
  history: History
}

interface ExercisesState {
  exercises: Exercise[]
  newExerciseName: string
  newExerciseDistance: string
  newExerciseTime: string
  newExerciseSpeed: string
  loadingExercises: boolean
}

export class Exercises extends React.PureComponent<ExercisesProps, ExercisesState> {
  state: ExercisesState = {
    exercises: [],
    newExerciseName: '',
    newExerciseDistance: '',
    newExerciseTime: '',
    newExerciseSpeed: '',
    loadingExercises: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExerciseName: event.target.value
    })
  }

  handleDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExerciseDistance: event.target.value
    })
  }

  handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExerciseTime: event.target.value
    })
  }

  handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExerciseSpeed: event.target.value
    })
  }

  onEditButtonClick = (exerciseId: string) => {
    this.props.history.push(`/exercises/${exerciseId}/edit`)
  }

  onExerciseCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newExercise = await createExercise(this.props.auth.getIdToken(), {
        name: this.state.newExerciseName,
        distance: this.state.newExerciseDistance,
        time: this.state.newExerciseTime,
        speed: this.state.newExerciseSpeed
      })
      this.setState({
        exercises: [...this.state.exercises, newExercise],
        newExerciseName: '',
        newExerciseDistance: '',
        newExerciseTime: '',
        newExerciseSpeed: ''
      })
    } catch {
      alert('Exercise creation failed')
    }
  }

  onExerciseDelete = async (exerciseId: string) => {
    try {
      await deleteExercise(this.props.auth.getIdToken(), exerciseId)
      this.setState({
        exercises: this.state.exercises.filter(exercise => exercise.exerciseId != exerciseId)
      })
    } catch {
      alert('Exercise deletion failed')
    }
  }

  onExerciseCheck = async (pos: number) => {
    try {
      const exercise = this.state.exercises[pos]
      await patchExercise(this.props.auth.getIdToken(), exercise.exerciseId, {
        name: exercise.name,
        distance: exercise.distance,
        time: exercise.time,
        speed: exercise.speed
      })
//      this.setState({
//        exercises: update(this.state.exercises, {
//          [pos]: { done: { $set: !exercise.done }}
//        })
//      })
    } catch {
      alert('Exercise deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const exercises = await getExercises(this.props.auth.getIdToken())
      this.setState({
        exercises,
        loadingExercises: false
      })
    } catch (e) {
      alert(`Failed to fetch exercises: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Exercises</Header>

        {this.renderCreateExerciseInput()}

        {this.renderExercises()}
      </div>
    )
  }

  renderCreateExerciseInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Exercise',
              onClick: this.onExerciseCreate
            }}
          />
          <Input 
            placeholder= "Enter Name"
            onChange={this.handleNameChange}
          />
          <Input 
            placeholder= "Enter Distance"
            onChange={this.handleDistanceChange}
          />
          <Input 
            placeholder= "Enter Time"
            onChange={this.handleTimeChange}
          />
          <Input 
            placeholder= "Enter Speed"
            onChange={this.handleSpeedChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExercises() {
    if (this.state.loadingExercises) {
      return this.renderLoading()
    }

    return this.renderExercisesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Exercises
        </Loader>
      </Grid.Row>
    )
  }

  renderExercisesList() {
    return (
      <Grid padded>
        {this.state.exercises.map((exercise, pos) => {
          return (
            <Grid.Row key={exercise.exerciseId}>
              <Grid.Column width={5} verticalAlign="middle">
                {exercise.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {exercise.distance}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {exercise.time}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {exercise.speed}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(exercise.exerciseId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExerciseDelete(exercise.exerciseId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {exercise.attachmentUrl && (
                <Image src={exercise.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
