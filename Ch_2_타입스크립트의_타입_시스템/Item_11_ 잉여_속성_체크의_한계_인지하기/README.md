# Item_6 잉여 속성 체크의 한계 인지하기

> 타입이 명시된 변수에 객체 리터럴을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 '그 외의 속성은 없는지' 확인함.

```ts
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
  //개체 리터럴은 알려진 속성만 지정할 수 있으면 "Room" 형식에 'elephant'이(가) 없습니다.
};

//but
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
};
const r2: Room = obj; //No Error
```

이러한 형상은

```ts
type Obj = {
  numDoors: number;
  ceilingHeightFt: number;
  elephant: string;
};
```

obj가 위와 같은 타입으로 추론되고

obj타입은 Room타입의 부분 집합을 포함하므로, Room에 할당 가능하며 타입 체커도 통과하기에 일어나는 일이다

## 잉여 속성 체크

위 두 예시 코드의 차이점을 살펴보겠다.

첫번째 예제에서는, 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 ' 잉여 속성 체크'라는 과정이 수행되었다

> 잉여 속성 체크는 할당 가능 검사와는 별도의 과정이라는 것을 인지 해야 타입스크립트의 타입 시스템에 대한 개념을 정확히 잡을수 있다

```ts
namespace Item11 {
  interface User {
    user_id: string;
    name: string;
    age: number;
  }

  interface GetUserDto {
    user_id: string;
    user_name?: string;
  }

  const user: User = {
    user_id: "user_id",
    name: "name",
    age: 20,

    /**
     * '{ user_id: string; name: string; age: number; school_name: string; }' 형식은 'User' 형식에 할당할 수 없습니다.
     * 개체 리터럴은 알려진 속성만 지정할 수 있으며 'User' 형식에 'school_name'이(가) 없습니다.
     */
    // school_name: "school_name",
  };
  const getUserDto: GetUserDto = user; // OK
  const getUserDto2: GetUserDto = {
    user_id: "user_id",
    user_name: "user_name",
    /**
     *  '{ user_id: string; user_name: string; age: number; }' 형식은 'GetUserDto' 형식에 할당할 수 없습니다.
     * 개체 리터럴은 알려진 속성만 지정할 수 있으며 'GetUserDto' 형식에 'age'이(가) 없습니다.
     *
     */
    // age: 20,
  };

  const getUser = (getUserDto: GetUserDto): User => {
    return {
      user_id: getUserDto.user_id,
      name: getUserDto.user_name || "",
      age: 0,
    };
  };

  const result1 = getUser(getUserDto); // OK
  const result2 = getUser(getUserDto2); // OK
  const result3 = getUser({
    user_id: "user_id",
    user_name: "user_name",
    // age: 20, // Error
  });
}
```

> 위와 같이 우리가 평소에 DTO를 정의하고, Item을 Dto의 정의대로 분리하지 않고 바로 인자로 사용할수 있는 것은 할당가능 검사를 통과하기 때문에 가능한 것이다.

    할당 가능 검사는 정의된 타입이 모두 존재하기만 한다면 통과가 된다.

> 하지만 잉여 속성 검사는 다르다.

```ts
const getUserDto2: GetUserDto = {
  user_id: "user_id",
  user_name: "user_name",
  /**
   *  '{ user_id: string; user_name: string; age: number; }' 형식은 'GetUserDto' 형식에 할당할 수 없습니다.
   * 개체 리터럴은 알려진 속성만 지정할 수 있으며 'GetUserDto' 형식에 'age'이(가) 없습니다.
   *
   */
  // age: 20,
};
```

> 잉여 속성 체크를 피해가는 방법 중 하나인 타입 단언은 지양 해야한다.
 - 그냥 사용하지 않는게 좋다.... (의도가 있을경우, 사용가능)

```ts
const getUserDto2: GetUserDto = {
  user_id: "user_id",
  user_name: "user_name",
  /**
   *  '{ user_id: string; user_name: string; age: number; }' 형식은 'GetUserDto' 형식에 할당할 수 없습니다.
   * 개체 리터럴은 알려진 속성만 지정할 수 있으며 'GetUserDto' 형식에 'age'이(가) 없습니다.
   *
   */
  age: 20,
} as GetUserDTO;
```


## 요약
- 객체 리터럴을 변수에 할당하거나 함수에 매개변수로 전달할 때 잉여 속성 체크가 수행된다

- 잉여 속성 체크는 오류를 찾는 효과적인 방법이지만, 타입스크립트 타입 체커가 수행하는 일반적인 구조적 할당 가능성 체크와 역할이 다르다. 할당의 개념을 정확히 알아야 잉여 속성 체크와 일반적인 구조적 할당 가능성 체크를 구분할 수 있다

- 잉여 속성 체크에는 한계가 있다. 임시 변수를 도입하면 잉여 속성 체크를 건너 뛸수 있다는 점을 기억해야 한다.



